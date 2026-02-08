import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PromocionalWithParticipante } from "../../types/fixture.api.type";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
});

interface TableGolesDocumentProps {
  groupId: number;
  data: PromocionalWithParticipante[];
}

export const TableGolesDocument = ({
  groupId,
  data,
}: TableGolesDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>EXAFAM 2024-2025 - Grupo {groupId}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Nombre Promocional</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Número de Goles</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Nombre de Promoción</Text>
          </View>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nombre_promocional}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.n_goles}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {item.promocion_participante.nombre_promocion}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
