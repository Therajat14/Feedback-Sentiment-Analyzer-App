import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Styles that resemble Tailwind's utility classes
const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#f9fafb", // Tailwind: bg-gray-100
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
    color: "#111827", // Tailwind: text-gray-900
  },
  feedbackCard: {
    backgroundColor: "#ffffff", // Tailwind: bg-white
    border: "1pt solid #e5e7eb", // Tailwind: border-gray-200
    borderRadius: 8, // Tailwind: rounded-lg
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // Tailwind: shadow-sm
  },
  fieldText: {
    marginBottom: 6,
    color: "#374151", // Tailwind: text-gray-700
  },
  fieldLabel: {
    fontWeight: "bold",
    color: "#1f2937", // Tailwind: text-gray-800
  },
});

const FeedbackPDF = ({ feedbacks }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>📋 Feedback Report</Text>

      {feedbacks.map((fb, index) => (
        <View key={index} style={styles.feedbackCard}>
          <Text style={styles.fieldText}>
            <Text style={styles.fieldLabel}>User: </Text>
            {fb.userId?.name || "Unknown User"}
          </Text>
          <Text style={styles.fieldText}>
            <Text style={styles.fieldLabel}>Sentiment: </Text>
            {fb.sentimentLabel || "N/A"} (
            {typeof fb.sentimentScore === "number"
              ? fb.sentimentScore.toFixed(2)
              : "N/A"}
            )
          </Text>
          <Text style={styles.fieldText}>
            <Text style={styles.fieldLabel}>Message: </Text>
            {fb.message}
          </Text>
          <Text style={styles.fieldText}>
            <Text style={styles.fieldLabel}>Date: </Text>
            {new Date(fb.createdAt).toLocaleString()}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default FeedbackPDF;
