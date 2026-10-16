import {
  Circle,
  Document,
  G,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Flag = "H" | "L" | "";

type Row =
  | { type: "category"; label: string }
  | {
      type: "test";
      test: string;
      result: string;
      unit: string;
      reference: string;
      flag: Flag;
    };

/* -------------------------------------------------------------------------- */
/*  DUMMY DATA                                                                 */
/* -------------------------------------------------------------------------- */

const lab = {
  name: "AURA DIAGNOSTICS",
  tagline: "Precision Pathology Laboratory",
  address: "1200 Medical Parkway, Suite 400",
  contact: "+1 (800) 555-0199  |  reports@auradiagnostics.com",
  accreditation: "NABL Accredited  |  Lab Reg. No. LAB-20931",
};

const patient = {
  name: "Alexander Sterling",
  ageGender: "42 Yrs / Male",
  patientId: "MRN-8472-991",
  referredBy: "Dr. Sarah Smith, MD",
  sampleType: "Whole Blood (EDTA)",
  sampleId: "SMP-2026-104-552",
  collected: "13-Oct-2026, 08:30 AM",
  received: "13-Oct-2026, 09:05 AM",
  reported: "13-Oct-2026, 11:45 AM",
};

const rows: Row[] = [
  { type: "category", label: "Red Blood Cells (RBC)" },
  {
    type: "test",
    test: "Hemoglobin (Hb)",
    result: "14.8",
    unit: "g/dL",
    reference: "13.0 - 17.0",
    flag: "",
  },
  {
    type: "test",
    test: "Total RBC Count",
    result: "4.9",
    unit: "mill/cumm",
    reference: "4.5 - 5.5",
    flag: "",
  },
  {
    type: "test",
    test: "PCV / Hematocrit",
    result: "44.0",
    unit: "%",
    reference: "40.0 - 50.0",
    flag: "",
  },
  {
    type: "test",
    test: "MCV",
    result: "89.5",
    unit: "fL",
    reference: "83.0 - 101.0",
    flag: "",
  },
  {
    type: "test",
    test: "MCH",
    result: "30.2",
    unit: "pg",
    reference: "27.0 - 32.0",
    flag: "",
  },
  {
    type: "test",
    test: "MCHC",
    result: "33.7",
    unit: "g/dL",
    reference: "31.5 - 34.5",
    flag: "",
  },

  { type: "category", label: "White Blood Cells (WBC)" },
  // Intentionally elevated to demonstrate abnormal-result styling
  {
    type: "test",
    test: "Total Leucocyte Count",
    result: "11,500",
    unit: "/cumm",
    reference: "4,000 - 10,000",
    flag: "H",
  },

  { type: "category", label: "Differential Leucocyte Count" },
  {
    type: "test",
    test: "Neutrophils",
    result: "62",
    unit: "%",
    reference: "40 - 80",
    flag: "",
  },
  {
    type: "test",
    test: "Lymphocytes",
    result: "28",
    unit: "%",
    reference: "20 - 40",
    flag: "",
  },
  {
    type: "test",
    test: "Monocytes",
    result: "7",
    unit: "%",
    reference: "2 - 10",
    flag: "",
  },
  {
    type: "test",
    test: "Eosinophils",
    result: "3",
    unit: "%",
    reference: "1 - 6",
    flag: "",
  },

  { type: "category", label: "Platelets" },
  {
    type: "test",
    test: "Platelet Count",
    result: "285,000",
    unit: "/cumm",
    reference: "150,000 - 410,000",
    flag: "",
  },
];

/* -------------------------------------------------------------------------- */
/*  DESIGN TOKENS                                                              */
/* -------------------------------------------------------------------------- */

const colors = {
  brand: "#0f172a",
  accent: "#2563eb",
  accentSoft: "#eff6ff",
  textMain: "#334155",
  textMuted: "#64748b",
  bgLight: "#f8fafc",
  border: "#e2e8f0",
  danger: "#dc2626",
  dangerSoft: "#fef2f2",
  dangerBorder: "#fecaca",
  success: "#16a34a",
  white: "#ffffff",
};

/* -------------------------------------------------------------------------- */
/*  DUMMY GRAPHICS (all vector, no image assets needed)                        */
/* -------------------------------------------------------------------------- */

/** Dummy logo: dark rounded tile with a blue droplet and highlight. */
const Logo = ({ size = 38 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x={0} y={0} width={40} height={40} rx={9} fill={colors.brand} />
    <G transform="translate(8 7) scale(1)">
      <Path
        d="M12 1 C9 6 4 11 4 17 C4 21.5 7.6 25 12 25 C16.4 25 20 21.5 20 17 C20 11 15 6 12 1 Z"
        fill={colors.accent}
      />
      <Circle cx={9} cy={17} r={2.2} fill={colors.white} opacity={0.85} />
    </G>
  </Svg>
);

/** Tiny seeded PRNG so dummy codes look the same on every render. */
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

/** Dummy QR code: 21x21 grid with three finder patterns + random modules. */
const QRCodeDummy = ({ size = 50 }: { size?: number }) => {
  const N = 21;
  const cell = size / N;
  const rand = seeded(8472991);
  const cells: { x: number; y: number }[] = [];

  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      if (rand() > 0.52) cells.push({ x, y });
    }
  }

  const Finder = ({ ox, oy }: { ox: number; oy: number }) => (
    <G>
      <Rect
        x={ox * cell}
        y={oy * cell}
        width={7 * cell}
        height={7 * cell}
        fill={colors.brand}
      />
      <Rect
        x={(ox + 1) * cell}
        y={(oy + 1) * cell}
        width={5 * cell}
        height={5 * cell}
        fill={colors.white}
      />
      <Rect
        x={(ox + 2) * cell}
        y={(oy + 2) * cell}
        width={3 * cell}
        height={3 * cell}
        fill={colors.brand}
      />
    </G>
  );

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={colors.white} />
      <Finder ox={0} oy={0} />
      <Finder ox={N - 7} oy={0} />
      <Finder ox={0} oy={N - 7} />
      {cells.map((c, i) => (
        <Rect
          key={i}
          x={c.x * cell}
          y={c.y * cell}
          width={cell + 0.2}
          height={cell + 0.2}
          fill={colors.brand}
        />
      ))}
    </Svg>
  );
};

/** Dummy barcode: deterministic bar/space widths scaled to the given width. */
const BarcodeDummy = ({
  width = 130,
  height = 22,
}: {
  width?: number;
  height?: number;
}) => {
  const rand = seeded(104552);
  const widths: number[] = [];
  for (let i = 0; i < 64; i++) widths.push(1 + Math.floor(rand() * 3)); // 1..3
  const total = widths.reduce((a, b) => a + b, 0);
  const unit = width / total;

  let x = 0;
  const bars: { x: number; w: number }[] = [];
  widths.forEach((w, i) => {
    if (i % 2 === 0) bars.push({ x, w: w * unit });
    x += w * unit;
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {bars.map((b, i) => (
        <Rect
          key={i}
          x={b.x}
          y={0}
          width={b.w}
          height={height}
          fill={colors.brand}
        />
      ))}
    </Svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  STYLES                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    color: colors.textMain,
    fontFamily: "Helvetica",
    paddingTop: 24,
    paddingBottom: 54,
    paddingHorizontal: 36,
    fontSize: 9.5,
  },

  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: colors.accent,
  },

  /* header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandWrap: { flexDirection: "row", alignItems: "center" },
  brandText: { marginLeft: 10 },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: colors.brand,
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: colors.accent,
    marginTop: 2,
  },
  brandContact: { fontSize: 7.5, color: colors.textMuted, marginTop: 2 },
  qrWrap: { alignItems: "center" },
  qrFrame: {
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  qrCaption: {
    fontFamily: "Helvetica-Bold",
    fontSize: 5.5,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginTop: 2,
  },

  /* patient card */
  patientCard: {
    flexDirection: "row",
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  patientCol: { flex: 1 },
  patientDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  patientRow: { flexDirection: "row", marginBottom: 4 },
  patientRowLast: { flexDirection: "row" },
  patientLabel: {
    width: 74,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: colors.textMuted,
    letterSpacing: 0.4,
    paddingTop: 1.5,
  },
  patientValue: { flex: 1, fontSize: 9, color: colors.textMain },
  patientName: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: colors.brand,
  },

  /* title row */
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  reportTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: colors.brand,
  },
  reportSubtitle: { fontSize: 8, color: colors.textMuted, marginTop: 2 },
  barcodeWrap: { alignItems: "center" },
  barcodeText: {
    fontFamily: "Courier",
    fontSize: 6.5,
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  /* table */
  table: { width: "100%", marginBottom: 8 },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.brand,
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  categoryRow: {
    backgroundColor: colors.bgLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  categoryText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: colors.brand,
    letterSpacing: 0.4,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4.5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dataRowAbnormal: { backgroundColor: colors.dangerSoft },

  colTest: { width: "34%" },
  colResult: { width: "15%", textAlign: "center" },
  colFlag: { width: "10%", alignItems: "center" },
  colUnit: { width: "16%", textAlign: "center" },
  colRef: { width: "25%", textAlign: "right" },

  testName: { fontSize: 9.5, color: colors.textMain },
  resultText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: colors.brand,
  },
  resultAbnormal: { color: colors.danger },
  unitText: { fontSize: 8.5, color: colors.textMuted },
  refText: { fontSize: 8.5, color: colors.textMuted },

  flagPill: {
    width: 16,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  flagPillText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: colors.white,
  },

  /* end + signatures */
  endRow: { flexDirection: "row", alignItems: "center" },
  endLine: { flex: 1, height: 1, backgroundColor: colors.border },
  endText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginHorizontal: 8,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  sigBlock: { width: 150, marginLeft: 30 },
  sigName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: colors.brand,
    borderTopWidth: 1,
    borderTopColor: colors.textMuted,
    paddingTop: 4,
  },
  sigTitle: { fontSize: 7.5, color: colors.textMuted, marginTop: 1 },

  /* footer */
  footer: {
    position: "absolute",
    bottom: 16,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  footerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLineGap: { marginBottom: 2 },
  footerText: { fontSize: 7, color: colors.textMuted },
  footerBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: colors.brand,
  },
});

/* -------------------------------------------------------------------------- */
/*  SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

const MetaRow = ({
  label,
  value,
  highlight = false,
  last = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) => (
  <View style={last ? styles.patientRowLast : styles.patientRow}>
    <Text style={styles.patientLabel}>{label}</Text>
    <Text style={highlight ? styles.patientName : styles.patientValue}>
      {value}
    </Text>
  </View>
);

/* -------------------------------------------------------------------------- */
/*  REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default function Report() {
  return (
    <Document
      title={`${patient.name} - CBC Report`}
      author={lab.name}
      subject="Complete Blood Count"
    >
      {/* Fits on a single A4 page by design (tight spacing). */}
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        {/* ------------------------------ HEADER ------------------------------ */}
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Logo />
            <View style={styles.brandText}>
              <Text style={styles.brandName}>{lab.name}</Text>
              <Text style={styles.brandTagline}>{lab.tagline}</Text>
              <Text style={styles.brandContact}>
                {lab.address} | {lab.contact}
              </Text>
            </View>
          </View>
          <View style={styles.qrWrap}>
            <View style={styles.qrFrame}>
              <QRCodeDummy size={44} />
            </View>
            <Text style={styles.qrCaption}>SCAN TO VERIFY</Text>
          </View>
        </View>

        {/* ------------------------- PATIENT SECTION -------------------------- */}
        <View style={styles.patientCard}>
          <View style={styles.patientCol}>
            <MetaRow label="PATIENT NAME" value={patient.name} highlight />
            <MetaRow label="AGE / GENDER" value={patient.ageGender} />
            <MetaRow label="PATIENT ID" value={patient.patientId} />
            <MetaRow label="REFERRED BY" value={patient.referredBy} last />
          </View>
          <View style={styles.patientDivider} />
          <View style={styles.patientCol}>
            <MetaRow label="SAMPLE" value={patient.sampleType} />
            <MetaRow label="COLLECTED" value={patient.collected} />
            <MetaRow label="RECEIVED" value={patient.received} />
            <MetaRow label="REPORTED" value={patient.reported} last />
          </View>
        </View>

        {/* ---------------------- REPORT TITLE + BARCODE ---------------------- */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.reportTitle}>Complete Blood Count (CBC)</Text>
            <Text style={styles.reportSubtitle}>
              Automated Hematology Analyzer
            </Text>
          </View>
          <View style={styles.barcodeWrap}>
            <BarcodeDummy width={130} height={20} />
            <Text style={styles.barcodeText}>{patient.sampleId}</Text>
          </View>
        </View>

        {/* ------------------------------- TABLE ------------------------------ */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colTest]}>TEST DESCRIPTION</Text>
            <Text style={[styles.th, styles.colResult]}>RESULT</Text>
            <Text style={[styles.th, styles.colFlag]}>FLAG</Text>
            <Text style={[styles.th, styles.colUnit]}>UNIT</Text>
            <Text style={[styles.th, styles.colRef]}>REFERENCE INTERVAL</Text>
          </View>

          {rows.map((row, idx) => {
            if (row.type === "category") {
              return (
                <View key={idx} style={styles.categoryRow}>
                  <Text style={styles.categoryText}>
                    {row.label.toUpperCase()}
                  </Text>
                </View>
              );
            }

            const abnormal = row.flag !== "";

            return (
              <View
                key={idx}
                style={
                  abnormal
                    ? [styles.dataRow, styles.dataRowAbnormal]
                    : styles.dataRow
                }
              >
                <Text style={[styles.testName, styles.colTest]}>
                  {row.test}
                </Text>
                <Text
                  style={[
                    styles.resultText,
                    styles.colResult,
                    abnormal ? styles.resultAbnormal : {},
                  ]}
                >
                  {row.result}
                </Text>
                <View style={styles.colFlag}>
                  {abnormal ? (
                    <View style={styles.flagPill}>
                      <Text style={styles.flagPillText}>{row.flag}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.unitText, styles.colUnit]}>
                  {row.unit}
                </Text>
                <Text style={[styles.refText, styles.colRef]}>
                  {row.reference}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ------------------------ END OF REPORT + SIGN ---------------------- */}
        <View style={styles.endRow}>
          <View style={styles.endLine} />
          <Text style={styles.endText}>END OF REPORT</Text>
          <View style={styles.endLine} />
        </View>

        <View style={styles.signatures}>
          <View style={styles.sigBlock}>
            <Text style={styles.sigName}>David Chen</Text>
            <Text style={styles.sigTitle}>Senior Medical Technologist</Text>
          </View>
          <View style={styles.sigBlock}>
            <Text style={styles.sigName}>Dr. Elena Rostova, MD</Text>
            <Text style={styles.sigTitle}>Chief Pathologist</Text>
          </View>
        </View>

        {/* ------------------------------ FOOTER ------------------------------ */}
        <View style={styles.footer}>
          <View style={[styles.footerLine, styles.footerLineGap]}>
            <Text style={styles.footerBold}>{lab.name}</Text>
            <Text style={styles.footerText}>{lab.accreditation}</Text>
          </View>
          <View style={styles.footerLine}>
            <Text style={styles.footerText}>
              Electronically generated report. No physical signature required.
            </Text>
            <Text style={styles.footerText}>Page 1 of 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
