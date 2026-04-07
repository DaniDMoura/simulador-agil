import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";
import header from "/header.png";
import gabarito from "/gabarito.png";

Font.register({
  family: 'HelveticaCustom',
  fonts: [
    {
      src: '/fonts/Helvetica.ttf'
    },
    {
      src: '/fonts/Helvetica-Bold.ttf',
      fontWeight: 'bold',
    },
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingVertical: 15,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#fafafa'
  },
  questionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  context: {
    fontSize: 10.5,
    marginBottom: 10,
    lineHeight: 1.4,
    color: '#34495e'
  },
  alternativa: {
    fontSize: 10.5,
    flex: 1,
    color: '#34495e',
    marginLeft: 5
  },
  alternativeImage: {
    maxWidth: 80,
    maxHeight: 80,
    marginLeft: 8
  },
  image: {
    maxHeight: 250,
    maxWidth: 250,
    marginTop: 10
  },
  questionsContainer: {
    paddingTop: 20,
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  questionContainer: {
    marginBottom: 18
  },
  alternativesIntroduction: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: 'bold',
    color: "#2c3e50"
  },
  alternativeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  alternativeLetter: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
    minWidth: 20
  },
  alternativeText: {
    fontSize: 10.5,
    color: '#34495e',
    flex: 1,
    marginRight: 8
  },
  gabaritoContainer: {
    marginTop: 20
  },
  gabaritoAnswers: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginHorizontal: 20
  },
  gabaritoItem: {
    fontSize: 10.5,
    color: '#34495e'
  },
  gabaritoAnswer: {
    fontWeight: 'bold'
  }
});

const Simulado = ({ questions }) => {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Nenhuma questão disponível</Text>
        </Page>
      </Document>
    );
  }

  const sortedQuestions = [...questions].sort(() => Math.random() - 0.5);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={{ padding: 0, margin: 0 }} src={header} />

        <View style={styles.questionsContainer}>
          {sortedQuestions.map((question, idx) => (
            <View key={idx} style={styles.questionContainer}>
              <Text style={styles.questionTitle}>
                (ENEM {question.year || 'N/A'}) Exercício {idx + 1}
              </Text>

              {question.files &&
                question.files.length > 0 &&
                question.files.map((file, i) => (
                  <Image style={styles.image} key={i} src={file} />
                ))}

              {question.context && (
                <Text style={styles.context}>
                  {question.context.replace(/\*/g,'').replace(/!\[.*?\]\(.*?\)/g,'')}
                </Text>
              )}

              {question.alternativesIntroduction && (
                <Text style={styles.alternativesIntroduction}>
                  {question.alternativesIntroduction}
                </Text>
              )}

              {question.alternatives && question.alternatives.length > 0 && (
                <View>
                  {question.alternatives.map((alternative, i) => (
                    <View key={i} style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginBottom: 6,
                      ...(alternative.file && { maxWidth: 100 })
                    }}>
                      <Text style={styles.alternativeLetter}>
                        {`${alternative.letter ? alternative.letter.toLowerCase() : String.fromCharCode(97 + i)}) `}
                      </Text>
                      <Text style={styles.alternativeText}>
                        {alternative.text || ''}
                      </Text>
                      {alternative.file && (
                        <Image
                          style={styles.alternativeImage}
                          src={alternative.file}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.gabaritoContainer}>
          <Image style={{ padding: 0, marginBottom: 10 }} src={gabarito} />
          <View style={styles.gabaritoAnswers}>
            {sortedQuestions.map((question, idx) => (
              <View key={idx}>
                <Text style={styles.gabaritoItem}>
                  {idx + 1}: <Text style={styles.gabaritoAnswer}>
                    {question.correctAlternative || 'N/A'}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Simulado;