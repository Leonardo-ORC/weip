/**
 * Curated lexicons for deterministic biomedical + women's health
 * entity extraction. Kept intentionally conservative — we prefer
 * high-precision hits over noisy recall.
 */

import type { BiomedicalEntityKind, WomensHealthConcept } from "../types";

export interface LexiconEntry<T extends string> {
  readonly label: string;
  readonly kind: T;
  readonly aliases: readonly string[];
}

export const BIOMEDICAL_LEXICON: readonly LexiconEntry<BiomedicalEntityKind>[] = [
  // hormones
  { label: "Estrogen", kind: "hormone", aliases: ["estrogen", "oestrogen", "estradiol", "e2"] },
  { label: "Progesterone", kind: "hormone", aliases: ["progesterone", "progestin", "progestogen"] },
  { label: "Testosterone", kind: "hormone", aliases: ["testosterone"] },
  { label: "FSH", kind: "hormone", aliases: ["follicle stimulating hormone", "fsh"] },
  { label: "LH", kind: "hormone", aliases: ["luteinizing hormone", "lh"] },
  { label: "AMH", kind: "hormone", aliases: ["anti-mullerian hormone", "amh"] },
  { label: "Prolactin", kind: "hormone", aliases: ["prolactin"] },
  { label: "Cortisol", kind: "hormone", aliases: ["cortisol"] },
  { label: "Insulin", kind: "hormone", aliases: ["insulin"] },
  { label: "Thyroid hormone", kind: "hormone", aliases: ["thyroid hormone", "tsh", "t3", "t4"] },
  // conditions / diseases
  { label: "PCOS", kind: "condition", aliases: ["polycystic ovary syndrome", "pcos"] },
  { label: "Endometriosis", kind: "condition", aliases: ["endometriosis"] },
  { label: "Uterine fibroids", kind: "condition", aliases: ["uterine fibroid", "leiomyoma", "myoma"] },
  { label: "Osteoporosis", kind: "disease", aliases: ["osteoporosis", "bone density loss"] },
  { label: "Breast cancer", kind: "disease", aliases: ["breast cancer", "breast carcinoma"] },
  { label: "Ovarian cancer", kind: "disease", aliases: ["ovarian cancer"] },
  { label: "Cervical cancer", kind: "disease", aliases: ["cervical cancer"] },
  { label: "Endometrial cancer", kind: "disease", aliases: ["endometrial cancer"] },
  { label: "Gestational diabetes", kind: "disease", aliases: ["gestational diabetes", "gdm"] },
  { label: "Preeclampsia", kind: "condition", aliases: ["preeclampsia", "pre-eclampsia"] },
  { label: "Hypothyroidism", kind: "disease", aliases: ["hypothyroidism"] },
  { label: "Hyperthyroidism", kind: "disease", aliases: ["hyperthyroidism"] },
  { label: "Insulin resistance", kind: "condition", aliases: ["insulin resistance"] },
  { label: "Metabolic syndrome", kind: "condition", aliases: ["metabolic syndrome"] },
  { label: "Depression", kind: "condition", aliases: ["depression", "depressive disorder"] },
  // drugs
  { label: "Metformin", kind: "drug", aliases: ["metformin"] },
  { label: "Letrozole", kind: "drug", aliases: ["letrozole"] },
  { label: "Clomiphene", kind: "drug", aliases: ["clomiphene", "clomifene"] },
  { label: "Tamoxifen", kind: "drug", aliases: ["tamoxifen"] },
  { label: "GnRH agonist", kind: "drug", aliases: ["gnrh agonist", "leuprolide"] },
  { label: "Combined oral contraceptive", kind: "drug", aliases: ["combined oral contraceptive", "coc", "oral contraceptive"] },
  { label: "Levonorgestrel", kind: "drug", aliases: ["levonorgestrel"] },
  { label: "Drospirenone", kind: "drug", aliases: ["drospirenone"] },
  { label: "Ethinylestradiol", kind: "drug", aliases: ["ethinylestradiol", "ethinyl estradiol"] },
  { label: "HRT", kind: "drug", aliases: ["hormone replacement therapy", "hrt", "menopausal hormone therapy", "mht"] },
  // biomarkers / labs
  { label: "HbA1c", kind: "biomarker", aliases: ["hba1c", "glycated hemoglobin"] },
  { label: "LDL", kind: "biomarker", aliases: ["ldl cholesterol", "ldl-c"] },
  { label: "HDL", kind: "biomarker", aliases: ["hdl cholesterol", "hdl-c"] },
  { label: "CA-125", kind: "biomarker", aliases: ["ca-125", "ca 125", "ca125"] },
  { label: "Bone mineral density", kind: "lab-test", aliases: ["bone mineral density", "bmd", "dxa"] },
  // outcomes
  { label: "Live birth rate", kind: "clinical-outcome", aliases: ["live birth rate", "live-birth rate"] },
  { label: "Pregnancy rate", kind: "clinical-outcome", aliases: ["pregnancy rate", "clinical pregnancy rate"] },
  { label: "Ovulation rate", kind: "clinical-outcome", aliases: ["ovulation rate"] },
  { label: "Menstrual regularity", kind: "clinical-outcome", aliases: ["menstrual regularity", "cycle regularity"] },
  // procedures
  { label: "Hysterectomy", kind: "procedure", aliases: ["hysterectomy"] },
  { label: "Oophorectomy", kind: "procedure", aliases: ["oophorectomy"] },
  { label: "Laparoscopy", kind: "procedure", aliases: ["laparoscopy"] },
  { label: "In vitro fertilization", kind: "procedure", aliases: ["in vitro fertilization", "ivf"] },
  { label: "Intrauterine insemination", kind: "procedure", aliases: ["intrauterine insemination", "iui"] },
  // devices
  { label: "Intrauterine device", kind: "device", aliases: ["intrauterine device", "iud"] },
];

export const WOMENS_HEALTH_LEXICON: readonly LexiconEntry<WomensHealthConcept>[] = [
  { label: "Pregnancy", kind: "pregnancy", aliases: ["pregnant", "pregnancy", "gestation", "gravid"] },
  { label: "Trimester", kind: "trimester", aliases: ["first trimester", "second trimester", "third trimester", "trimester"] },
  { label: "Breastfeeding", kind: "breastfeeding", aliases: ["breastfeeding", "lactation", "nursing"] },
  { label: "Postpartum", kind: "postpartum", aliases: ["postpartum", "post-partum", "puerperium"] },
  { label: "Menopause", kind: "menopause", aliases: ["menopause", "menopausal", "postmenopausal", "post-menopausal"] },
  { label: "Perimenopause", kind: "perimenopause", aliases: ["perimenopause", "peri-menopause", "menopausal transition"] },
  { label: "Premenopause", kind: "premenopause", aliases: ["premenopause", "pre-menopause", "premenopausal"] },
  { label: "PCOS", kind: "pcos", aliases: ["polycystic ovary syndrome", "pcos"] },
  { label: "Endometriosis", kind: "endometriosis", aliases: ["endometriosis"] },
  { label: "Fertility", kind: "fertility", aliases: ["fertility", "infertility", "subfertility"] },
  { label: "IVF", kind: "ivf", aliases: ["in vitro fertilization", "ivf", "assisted reproductive technology", "art"] },
  { label: "Contraception", kind: "contraception", aliases: ["contraception", "contraceptive", "birth control"] },
  { label: "Hormonal therapy", kind: "hormonal-therapy", aliases: ["hormone therapy", "hormonal therapy", "hrt", "mht"] },
  { label: "Menstrual cycle", kind: "menstrual-cycle", aliases: ["menstrual cycle", "menstruation", "menses"] },
  { label: "Gynecologic", kind: "gynecologic", aliases: ["gynecologic", "gynaecologic", "gynecology"] },
  { label: "Reproductive health", kind: "reproductive-health", aliases: ["reproductive health", "reproductive-age", "women of reproductive age"] },
];
