from typing import List, Dict
import asyncio
import logging
import random
import httpx

logging.basicConfig(level=logging.INFO)

async def get_questions(number_questions: int,
                        ciencias_natureza: bool,
                        ciencias_humanas: bool,
                        matematica: bool,
                        linguagens: bool,
                        min_year: int,
                        max_year: int,
                        ) -> List[Dict[str, object]]:
    total_questions = 0
    dados = []
    area_filters = []
    ids_usados = set()
    repeticoes = 0
    max_repeticoes = 100
    base_delay = 1
    retry_backoff = 1

    if ciencias_natureza:
        area_filters.append("ciencias-natureza")
    if ciencias_humanas:
        area_filters.append("ciencias-humanas")
    if matematica:
        area_filters.append("matematica")
    if linguagens:
        area_filters.append("linguagens")

    if not area_filters:
        return []

    async with httpx.AsyncClient(timeout=10) as client:
        limit = 5
        while total_questions < number_questions and repeticoes < max_repeticoes:
            offset = random.randint(0, 180)
            year = random.randint(min_year, max_year)

            url = f'https://api.enem.dev/v1/exams/{year}/questions'
            params = {'offset': offset, 'limit': limit}

            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                questions = data.get('questions', [])

            except Exception as e:
                logging.error(f"Erro persistente ao buscar questões: {e}")
                await asyncio.sleep(base_delay * retry_backoff)
                retry_backoff * 2
                continue

            for i, q in enumerate(questions):
                qid = f"{year:04}{offset + i:03}"
                if total_questions >= number_questions:
                    break
                if q.get('discipline') not in area_filters:
                    continue
                if qid in ids_usados:
                    repeticoes += 1
                    logging.warning(f"Nº{repeticoes} Questão repetida ignorada: {qid}")
                    continue

                question = {
                    'title': f'Exercício {qid}',
                    'discipline': q.get('discipline', ''),
                    'year': year,
                    'correctAlternative': q.get('correctAlternative', ''),
                    'context': q.get('context', ''),
                    'files': q.get('files', []),
                    'alternativesIntroduction': q.get(
                        'alternativesIntroduction', ''
                    ),
                    'alternatives': q.get('alternatives', []),
                }

                ids_usados.add(qid)
                dados.append(question)
                total_questions += 1

    return random.sample(dados, len(dados))
