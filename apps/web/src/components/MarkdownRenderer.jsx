import React from 'react';
import { Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import { lexer } from 'marked';
import { isValidImageUrl, resolveImageUrl } from '../utils/pdfLayout';

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  image: {
    maxHeight: 250,
    maxWidth: '100%',
    marginVertical: 8,
    alignSelf: 'center'
  },
  imageFallback: {
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#cc0000',
    backgroundColor: '#fff0f0',
    marginVertical: 4,
  },
  imageFallbackText: {
    fontSize: 7,
    color: '#cc0000',
  },
  paragraph: {
    marginBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 9,
    lineHeight: 1.3,
  }
});

const MarkdownImage = ({ href }) => {
  const resolved = resolveImageUrl(href);

  if (!resolved || !isValidImageUrl(resolved)) {
    return (
      <View style={styles.imageFallback}>
        <Text style={styles.imageFallbackText}>
          Imagem indisponível: {href || 'URL ausente'}
        </Text>
      </View>
    );
  }

  return <Image src={resolved} style={styles.image} />;
};

/**
 * Renders Markdown content using @react-pdf/renderer components.
 * Optimizes for PDF stability by using flat structures where possible.
 */
const MarkdownRenderer = ({ content, textStyle = {} }) => {
  if (!content) return null;

  try {
    const tokens = lexer(content);

    const renderInline = (inlineTokens, baseStyle) => {
      if (!inlineTokens) return null;
      
      return inlineTokens.map((token, index) => {
        const combinedStyle = [styles.text, baseStyle];
        
        switch (token.type) {
          case 'strong':
            return <Text key={index} style={[...combinedStyle, styles.bold]}>{token.text}</Text>;
          case 'em':
            return <Text key={index} style={[...combinedStyle, styles.italic]}>{token.text}</Text>;
          case 'text':
            return <Text key={index} style={combinedStyle}>{token.text}</Text>;
          case 'br':
            return <Text key={index}>{"\n"}</Text>;
          case 'image':
            return <MarkdownImage key={index} href={token.href} />;
          default:
            return <Text key={index} style={combinedStyle}>{token.text || token.raw}</Text>;
        }
      });
    };

    const renderBlocks = (blockTokens) => {
      return blockTokens.map((token, index) => {
        switch (token.type) {
          case 'paragraph':
            return (
              <View key={index} style={styles.paragraph} wrap={true}>
                {renderInline(token.tokens, textStyle)}
              </View>
            );
          case 'image':
            return <MarkdownImage key={index} href={token.href} />;
          case 'space':
            return null;
          default:
            return token.tokens ? 
              <View key={index} style={styles.paragraph}>{renderInline(token.tokens, textStyle)}</View> : 
              null;
        }
      });
    };

    return <View>{renderBlocks(tokens)}</View>;
  } catch {
    return <Text style={[styles.text, textStyle]}>{content}</Text>;
  }
};

export default MarkdownRenderer;
