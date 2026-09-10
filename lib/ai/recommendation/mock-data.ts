import { ProductData } from "./schemas";

export const MOCK_PRODUCTS: ProductData[] = [
  {
    id: "prod_health_1",
    name: "SafeGuard Comprehensive Health",
    category: "health_insurance",
    premium: 4500, // Monthly premium
    coverageAmount: 1000000, // 10 Lakh
    features: ["term life insurance", "parents", "maternity", "daycare"],
    exclusions: ["pre-existing conditions within first 2 years", "cosmetic surgery"],
    riskLevel: "low",
    isMock: true,
  },
  {
    id: "prod_health_2",
    name: "Budget Care Plus",
    category: "health_insurance",
    premium: 1500, 
    coverageAmount: 500000, 
    features: ["hospitalization", "parents"],
    exclusions: ["maternity", "OPD", "pre-existing conditions within first 4 years", "cosmetic surgery"],
    riskLevel: "low",
    isMock: true,
  },
  {
    id: "prod_health_3",
    name: "Premium Global Health",
    category: "health_insurance",
    premium: 12000, 
    coverageAmount: 5000000, 
    features: ["global coverage", "parents", "maternity", "zero waiting period"],
    exclusions: ["experimental treatments"],
    riskLevel: "low",
    isMock: true,
  },
  {
    id: "prod_mf_1",
    name: "Steady Growth Index Fund",
    category: "mutual_fund",
    premium: 5000, // Min SIP
    coverageAmount: null,
    features: ["long term", "equity", "retirement", "best performing"],
    exclusions: [],
    riskLevel: "high",
    isMock: true,
  },
  {
    id: "prod_mf_2",
    name: "Conservative Debt Fund",
    category: "mutual_fund",
    premium: 1000, 
    coverageAmount: null,
    features: ["short term", "debt", "emergency fund"],
    exclusions: [],
    riskLevel: "low",
    isMock: true,
  }
];
