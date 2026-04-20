import React, { useMemo } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer";
import MarkdownRenderer from "./components/MarkdownRenderer";

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/fonts/Helvetica.ttf' },
    { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 8.5,
    color: '#444',
  },
  // Stable 2-column structure
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    width: '49%',
    flexDirection: 'column',
  },
  questionContainer: {
    width: '100%',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  questionTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000",
  },
  context: {
    fontSize: 8.5,
    marginBottom: 4,
    lineHeight: 1.2,
    color: '#111'
  },
  alternativesIntroduction: {
    marginBottom: 3,
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  alternativeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    paddingLeft: 4,
  },
  alternativeLetter: {
    fontWeight: 'bold',
    marginRight: 4,
    width: 12,
    fontSize: 8.5,
  },
  alternativeText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.2,
  },
  gabaritoSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 8,
  },
  gabaritoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  gabaritoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gabaritoItem: {
    width: '10%',
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8.5,
  },
  gabaritoNumber: {
    fontWeight: 'bold',
    marginRight: 2,
  }
});

const SimuladoHeader = () => (
  <View style={styles.headerContainer} fixed>
    <View>
      <Text style={styles.headerTitle}>Simulador Ágil</Text>
      <Text style={styles.headerSubtitle}>Caderno de Questões - Exame Nacional</Text>
    </View>
    <View style={{ textAlign: 'right' }}>
      <Text style={styles.headerSubtitle}>Data: {new Date().toLocaleDateString('pt-BR')}</Text>
      <Text style={styles.headerSubtitle}>Folha de Respostas Anexa</Text>
    </View>
  </View>
);

const QuestionBlock = ({ question, index }) => (
  <View style={styles.questionContainer} wrap={false}>
    <Text style={styles.questionTitle}>
      {index + 1}. (ENEM {question.year || 'N/A'})
    </Text>

    <MarkdownRenderer 
      content={question.context} 
      textStyle={styles.context} 
    />

    {question.alternativesIntroduction && (
      <Text style={styles.alternativesIntroduction}>
        {question.alternativesIntroduction}
      </Text>
    )}

    <View>
      {question.alternatives?.map((alt, i) => (
        <View key={i} style={styles.alternativeRow} wrap={false}>
          <Text style={styles.alternativeLetter}>
            {`${alt.letter ? alt.letter.toLowerCase() : String.fromCharCode(97 + i)})`}
          </Text>
          <View style={styles.alternativeText}>
            <MarkdownRenderer 
              content={alt.text || ''} 
              textStyle={styles.alternativeText} 
            />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const Simulado = ({ questions }) => {
  const sortedQuestions = useMemo(() => {
    if (!questions || !Array.isArray(questions)) return [];
    return [...questions];
  }, [questions]);

  // Split questions into two columns for stability
  const leftColumn = sortedQuestions.filter((_, i) => i % 2 === 0);
  const rightColumn = sortedQuestions.filter((_, i) => i % 2 !== 0);

  if (sortedQuestions.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Nenhuma questão disponível</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <SimuladoHeader />

        <View style={styles.columnsContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftColumn.map((q, i) => (
              <QuestionBlock key={i} question={q} index={sortedQuestions.indexOf(q)} />
            ))}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {rightColumn.map((q, i) => (
              <QuestionBlock key={i} question={q} index={sortedQuestions.indexOf(q)} />
            ))}
          </View>
        </View>

        <View style={styles.gabaritoSection} break>
          <Text style={styles.gabaritoTitle}>GABARITO OFICIAL</Text>
          <View style={styles.gabaritoGrid}>
            {sortedQuestions.map((question, idx) => (
              <View key={`gab-${idx}`} style={styles.gabaritoItem}>
                <Text style={styles.gabaritoNumber}>{String(idx + 1).padStart(2, '0')}.</Text>
                <Text>{question.correctAlternative || '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default React.memo(Simulado);
