import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

const NA = null;

const COUNTRIES = [
  { id:"USA", name:"United States",        region:"Americas",      gdp:100, digitalMaturity:95, digitalReadiness:93, telecomStrategy:88, digitalEconomy:97, aiReadiness:100, dataCenters:100, digitalInfra:92, space:100, innovation:96 },
  { id:"CHN", name:"China",                region:"Asia-Pacific",  gdp:95,  digitalMaturity:85, digitalReadiness:80, telecomStrategy:92, digitalEconomy:88, aiReadiness:89,  dataCenters:88,  digitalInfra:87, space:88,  innovation:83 },
  { id:"DEU", name:"Germany",              region:"Europe",        gdp:75,  digitalMaturity:82, digitalReadiness:80, telecomStrategy:79, digitalEconomy:80, aiReadiness:77,  dataCenters:75,  digitalInfra:81, space:72,  innovation:88 },
  { id:"GBR", name:"United Kingdom",       region:"Europe",        gdp:71,  digitalMaturity:87, digitalReadiness:85, telecomStrategy:83, digitalEconomy:84, aiReadiness:85,  dataCenters:80,  digitalInfra:83, space:78,  innovation:87 },
  { id:"JPN", name:"Japan",                region:"Asia-Pacific",  gdp:77,  digitalMaturity:83, digitalReadiness:80, telecomStrategy:81, digitalEconomy:78, aiReadiness:80,  dataCenters:82,  digitalInfra:88, space:82,  innovation:84 },
  { id:"FRA", name:"France",               region:"Europe",        gdp:68,  digitalMaturity:80, digitalReadiness:78, telecomStrategy:77, digitalEconomy:76, aiReadiness:76,  dataCenters:72,  digitalInfra:79, space:80,  innovation:82 },
  { id:"KOR", name:"South Korea",          region:"Asia-Pacific",  gdp:60,  digitalMaturity:92, digitalReadiness:90, telecomStrategy:89, digitalEconomy:85, aiReadiness:83,  dataCenters:79,  digitalInfra:94, space:75,  innovation:90 },
  { id:"CAN", name:"Canada",               region:"Americas",      gdp:65,  digitalMaturity:84, digitalReadiness:82, telecomStrategy:78, digitalEconomy:79, aiReadiness:82,  dataCenters:76,  digitalInfra:80, space:68,  innovation:79 },
  { id:"AUS", name:"Australia",            region:"Asia-Pacific",  gdp:63,  digitalMaturity:81, digitalReadiness:79, telecomStrategy:75, digitalEconomy:74, aiReadiness:78,  dataCenters:68,  digitalInfra:76, space:65,  innovation:78 },
  { id:"IND", name:"India",                region:"Asia-Pacific",  gdp:72,  digitalMaturity:58, digitalReadiness:55, telecomStrategy:70, digitalEconomy:65, aiReadiness:67,  dataCenters:60,  digitalInfra:56, space:72,  innovation:67 },
  { id:"BRA", name:"Brazil",               region:"Americas",      gdp:58,  digitalMaturity:55, digitalReadiness:53, telecomStrategy:52, digitalEconomy:52, aiReadiness:55,  dataCenters:50,  digitalInfra:53, space:48,  innovation:54 },
  { id:"ITA", name:"Italy",                region:"Europe",        gdp:62,  digitalMaturity:68, digitalReadiness:65, telecomStrategy:63, digitalEconomy:62, aiReadiness:64,  dataCenters:60,  digitalInfra:66, space:62,  innovation:68 },
  { id:"RUS", name:"Russia",               region:"Europe",        gdp:62,  digitalMaturity:65, digitalReadiness:62, telecomStrategy:68, digitalEconomy:58, aiReadiness:65,  dataCenters:60,  digitalInfra:64, space:82,  innovation:60 },
  { id:"MEX", name:"Mexico",               region:"Americas",      gdp:50,  digitalMaturity:52, digitalReadiness:50, telecomStrategy:50, digitalEconomy:48, aiReadiness:50,  dataCenters:45,  digitalInfra:50, space:42,  innovation:48 },
  { id:"IDN", name:"Indonesia",            region:"Asia-Pacific",  gdp:55,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:58, digitalEconomy:52, aiReadiness:54,  dataCenters:48,  digitalInfra:53, space:42,  innovation:52 },
  { id:"TUR", name:"Turkey",               region:"MENA",          gdp:48,  digitalMaturity:62, digitalReadiness:60, telecomStrategy:65, digitalEconomy:58, aiReadiness:60,  dataCenters:55,  digitalInfra:62, space:55,  innovation:58 },
  { id:"SAU", name:"Saudi Arabia",         region:"MENA",          gdp:55,  digitalMaturity:78, digitalReadiness:76, telecomStrategy:85, digitalEconomy:74, aiReadiness:76,  dataCenters:70,  digitalInfra:78, space:58,  innovation:68 },
  { id:"ARG", name:"Argentina",            region:"Americas",      gdp:40,  digitalMaturity:50, digitalReadiness:48, telecomStrategy:46, digitalEconomy:44, aiReadiness:48,  dataCenters:40,  digitalInfra:48, space:38,  innovation:46 },
  { id:"ZAF", name:"South Africa",         region:"Africa",        gdp:35,  digitalMaturity:48, digitalReadiness:45, telecomStrategy:48, digitalEconomy:42, aiReadiness:44,  dataCenters:40,  digitalInfra:45, space:38,  innovation:45 },
  { id:"NLD", name:"Netherlands",          region:"Europe",        gdp:55,  digitalMaturity:90, digitalReadiness:88, telecomStrategy:85, digitalEconomy:88, aiReadiness:84,  dataCenters:88,  digitalInfra:89, space:65,  innovation:87 },
  { id:"ESP", name:"Spain",                region:"Europe",        gdp:57,  digitalMaturity:73, digitalReadiness:71, telecomStrategy:69, digitalEconomy:68, aiReadiness:68,  dataCenters:65,  digitalInfra:72, space:60,  innovation:70 },
  { id:"CHE", name:"Switzerland",          region:"Europe",        gdp:52,  digitalMaturity:89, digitalReadiness:87, telecomStrategy:83, digitalEconomy:85, aiReadiness:86,  dataCenters:78,  digitalInfra:88, space:58,  innovation:96 },
  { id:"SWE", name:"Sweden",               region:"Europe",        gdp:48,  digitalMaturity:91, digitalReadiness:89, telecomStrategy:86, digitalEconomy:87, aiReadiness:85,  dataCenters:80,  digitalInfra:90, space:60,  innovation:92 },
  { id:"FIN", name:"Finland",              region:"Europe",        gdp:38,  digitalMaturity:90, digitalReadiness:88, telecomStrategy:84, digitalEconomy:85, aiReadiness:84,  dataCenters:76,  digitalInfra:89, space:55,  innovation:89 },
  { id:"DNK", name:"Denmark",              region:"Europe",        gdp:40,  digitalMaturity:91, digitalReadiness:89, telecomStrategy:85, digitalEconomy:88, aiReadiness:83,  dataCenters:77,  digitalInfra:90, space:52,  innovation:90 },
  { id:"NOR", name:"Norway",               region:"Europe",        gdp:45,  digitalMaturity:89, digitalReadiness:87, telecomStrategy:82, digitalEconomy:84, aiReadiness:81,  dataCenters:72,  digitalInfra:88, space:55,  innovation:82 },
  { id:"AUT", name:"Austria",              region:"Europe",        gdp:43,  digitalMaturity:78, digitalReadiness:76, telecomStrategy:72, digitalEconomy:74, aiReadiness:73,  dataCenters:65,  digitalInfra:77, space:55,  innovation:79 },
  { id:"BEL", name:"Belgium",              region:"Europe",        gdp:44,  digitalMaturity:79, digitalReadiness:77, telecomStrategy:73, digitalEconomy:75, aiReadiness:74,  dataCenters:70,  digitalInfra:78, space:58,  innovation:78 },
  { id:"POL", name:"Poland",               region:"Europe",        gdp:42,  digitalMaturity:68, digitalReadiness:65, telecomStrategy:63, digitalEconomy:62, aiReadiness:63,  dataCenters:58,  digitalInfra:65, space:52,  innovation:65 },
  { id:"UKR", name:"Ukraine",              region:"Europe",        gdp:25,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:50, digitalEconomy:45, aiReadiness:50,  dataCenters:40,  digitalInfra:50, space:38,  innovation:52 },
  { id:"CZE", name:"Czech Republic",       region:"Europe",        gdp:38,  digitalMaturity:72, digitalReadiness:70, telecomStrategy:66, digitalEconomy:65, aiReadiness:66,  dataCenters:60,  digitalInfra:70, space:50,  innovation:72 },
  { id:"HUN", name:"Hungary",              region:"Europe",        gdp:35,  digitalMaturity:68, digitalReadiness:65, telecomStrategy:62, digitalEconomy:60, aiReadiness:62,  dataCenters:55,  digitalInfra:66, space:45,  innovation:65 },
  { id:"GRC", name:"Greece",               region:"Europe",        gdp:30,  digitalMaturity:60, digitalReadiness:57, telecomStrategy:55, digitalEconomy:55, aiReadiness:57,  dataCenters:48,  digitalInfra:58, space:45,  innovation:58 },
  { id:"PRT", name:"Portugal",             region:"Europe",        gdp:32,  digitalMaturity:70, digitalReadiness:68, telecomStrategy:65, digitalEconomy:64, aiReadiness:65,  dataCenters:58,  digitalInfra:69, space:48,  innovation:68 },
  { id:"IRE", name:"Ireland",              region:"Europe",        gdp:45,  digitalMaturity:83, digitalReadiness:81, telecomStrategy:78, digitalEconomy:85, aiReadiness:80,  dataCenters:90,  digitalInfra:82, space:55,  innovation:84 },
  { id:"LUX", name:"Luxembourg",           region:"Europe",        gdp:35,  digitalMaturity:85, digitalReadiness:83, telecomStrategy:80, digitalEconomy:86, aiReadiness:79,  dataCenters:82,  digitalInfra:84, space:52,  innovation:82 },
  { id:"ROU", name:"Romania",              region:"Europe",        gdp:32,  digitalMaturity:60, digitalReadiness:57, telecomStrategy:55, digitalEconomy:52, aiReadiness:55,  dataCenters:48,  digitalInfra:60, space:40,  innovation:52 },
  { id:"SVK", name:"Slovakia",             region:"Europe",        gdp:30,  digitalMaturity:63, digitalReadiness:61, telecomStrategy:58, digitalEconomy:58, aiReadiness:58,  dataCenters:45,  digitalInfra:62, space:38,  innovation:58 },
  { id:"BGR", name:"Bulgaria",             region:"Europe",        gdp:25,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:50, digitalEconomy:48, aiReadiness:50,  dataCenters:40,  digitalInfra:54, space:32,  innovation:46 },
  { id:"HRV", name:"Croatia",              region:"Europe",        gdp:26,  digitalMaturity:60, digitalReadiness:58, telecomStrategy:54, digitalEconomy:52, aiReadiness:53,  dataCenters:38,  digitalInfra:59, space:30,  innovation:52 },
  { id:"SVN", name:"Slovenia",             region:"Europe",        gdp:28,  digitalMaturity:65, digitalReadiness:63, telecomStrategy:60, digitalEconomy:60, aiReadiness:60,  dataCenters:42,  digitalInfra:64, space:35,  innovation:62 },
  { id:"LTU", name:"Lithuania",            region:"Europe",        gdp:28,  digitalMaturity:70, digitalReadiness:68, telecomStrategy:65, digitalEconomy:65, aiReadiness:63,  dataCenters:48,  digitalInfra:70, space:35,  innovation:64 },
  { id:"LVA", name:"Latvia",               region:"Europe",        gdp:26,  digitalMaturity:68, digitalReadiness:66, telecomStrategy:63, digitalEconomy:62, aiReadiness:61,  dataCenters:45,  digitalInfra:68, space:32,  innovation:60 },
  { id:"EST", name:"Estonia",              region:"Europe",        gdp:26,  digitalMaturity:85, digitalReadiness:83, telecomStrategy:80, digitalEconomy:82, aiReadiness:78,  dataCenters:55,  digitalInfra:84, space:38,  innovation:80 },
  { id:"BLR", name:"Belarus",              region:"Europe",        gdp:22,  digitalMaturity:52, digitalReadiness:48, telecomStrategy:45, digitalEconomy:40, aiReadiness:45,  dataCenters:30,  digitalInfra:50, space:28,  innovation:42 },
  { id:"SRB", name:"Serbia",               region:"Europe",        gdp:22,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:50, digitalEconomy:46, aiReadiness:48,  dataCenters:32,  digitalInfra:52, space:28,  innovation:46 },
  { id:"MKD", name:"North Macedonia",      region:"Europe",        gdp:15,  digitalMaturity:48, digitalReadiness:45, telecomStrategy:44, digitalEconomy:40, aiReadiness:42,  dataCenters:25,  digitalInfra:46, space:20,  innovation:38 },
  { id:"ALB", name:"Albania",              region:"Europe",        gdp:14,  digitalMaturity:45, digitalReadiness:42, telecomStrategy:42, digitalEconomy:38, aiReadiness:40,  dataCenters:22,  digitalInfra:43, space:18,  innovation:36 },
  { id:"BIH", name:"Bosnia & Herzegovina", region:"Europe",        gdp:14,  digitalMaturity:42, digitalReadiness:40, telecomStrategy:38, digitalEconomy:35, aiReadiness:38,  dataCenters:20,  digitalInfra:40, space:15,  innovation:33 },
  { id:"MDA", name:"Moldova",              region:"Europe",        gdp:12,  digitalMaturity:48, digitalReadiness:45, telecomStrategy:42, digitalEconomy:38, aiReadiness:40,  dataCenters:22,  digitalInfra:46, space:15,  innovation:36 },
  { id:"MNE", name:"Montenegro",           region:"Europe",        gdp:12,  digitalMaturity:50, digitalReadiness:48, telecomStrategy:46, digitalEconomy:42, aiReadiness:43,  dataCenters:24,  digitalInfra:48, space:18,  innovation:38 },
  { id:"ISL", name:"Iceland",              region:"Europe",        gdp:20,  digitalMaturity:88, digitalReadiness:86, telecomStrategy:82, digitalEconomy:83, aiReadiness:80,  dataCenters:65,  digitalInfra:87, space:42,  innovation:80 },
  { id:"CYP", name:"Cyprus",               region:"Europe",        gdp:18,  digitalMaturity:65, digitalReadiness:63, telecomStrategy:60, digitalEconomy:60, aiReadiness:58,  dataCenters:40,  digitalInfra:63, space:30,  innovation:55 },
  { id:"MLT", name:"Malta",                region:"Europe",        gdp:14,  digitalMaturity:72, digitalReadiness:70, telecomStrategy:68, digitalEconomy:70, aiReadiness:65,  dataCenters:50,  digitalInfra:71, space:25,  innovation:62 },
  { id:"AND", name:"Andorra",              region:"Europe",        gdp:8,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"LIE", name:"Liechtenstein",        region:"Europe",        gdp:8,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"MCO", name:"Monaco",               region:"Europe",        gdp:9,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"SMR", name:"San Marino",           region:"Europe",        gdp:7,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"VAT", name:"Vatican City",         region:"Europe",        gdp:NA,  digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"GEO", name:"Georgia",              region:"Europe",        gdp:16,  digitalMaturity:52, digitalReadiness:50, telecomStrategy:48, digitalEconomy:42, aiReadiness:44,  dataCenters:28,  digitalInfra:50, space:20,  innovation:40 },
  { id:"ARM", name:"Armenia",              region:"Europe",        gdp:14,  digitalMaturity:50, digitalReadiness:48, telecomStrategy:46, digitalEconomy:40, aiReadiness:42,  dataCenters:25,  digitalInfra:48, space:18,  innovation:38 },
  { id:"AZE", name:"Azerbaijan",           region:"Europe",        gdp:18,  digitalMaturity:52, digitalReadiness:50, telecomStrategy:52, digitalEconomy:44, aiReadiness:45,  dataCenters:28,  digitalInfra:50, space:22,  innovation:40 },
  { id:"ARE", name:"UAE",                  region:"MENA",          gdp:42,  digitalMaturity:85, digitalReadiness:83, telecomStrategy:88, digitalEconomy:82, aiReadiness:84,  dataCenters:78,  digitalInfra:84, space:72,  innovation:78 },
  { id:"ISR", name:"Israel",               region:"MENA",          gdp:38,  digitalMaturity:82, digitalReadiness:80, telecomStrategy:77, digitalEconomy:80, aiReadiness:82,  dataCenters:70,  digitalInfra:80, space:68,  innovation:90 },
  { id:"QAT", name:"Qatar",                region:"MENA",          gdp:38,  digitalMaturity:80, digitalReadiness:78, telecomStrategy:82, digitalEconomy:76, aiReadiness:75,  dataCenters:68,  digitalInfra:80, space:55,  innovation:70 },
  { id:"KWT", name:"Kuwait",               region:"MENA",          gdp:35,  digitalMaturity:68, digitalReadiness:65, telecomStrategy:70, digitalEconomy:60, aiReadiness:62,  dataCenters:55,  digitalInfra:66, space:42,  innovation:55 },
  { id:"BHR", name:"Bahrain",              region:"MENA",          gdp:28,  digitalMaturity:72, digitalReadiness:70, telecomStrategy:75, digitalEconomy:68, aiReadiness:68,  dataCenters:58,  digitalInfra:71, space:38,  innovation:62 },
  { id:"OMN", name:"Oman",                 region:"MENA",          gdp:30,  digitalMaturity:65, digitalReadiness:62, telecomStrategy:68, digitalEconomy:58, aiReadiness:60,  dataCenters:50,  digitalInfra:63, space:38,  innovation:55 },
  { id:"JOR", name:"Jordan",               region:"MENA",          gdp:22,  digitalMaturity:58, digitalReadiness:55, telecomStrategy:60, digitalEconomy:50, aiReadiness:52,  dataCenters:42,  digitalInfra:56, space:32,  innovation:50 },
  { id:"MAR", name:"Morocco",              region:"MENA",          gdp:28,  digitalMaturity:50, digitalReadiness:47, telecomStrategy:55, digitalEconomy:44, aiReadiness:45,  dataCenters:38,  digitalInfra:48, space:30,  innovation:45 },
  { id:"EGY", name:"Egypt",                region:"MENA",          gdp:38,  digitalMaturity:45, digitalReadiness:43, telecomStrategy:52, digitalEconomy:40, aiReadiness:42,  dataCenters:38,  digitalInfra:44, space:42,  innovation:42 },
  { id:"TUN", name:"Tunisia",              region:"MENA",          gdp:18,  digitalMaturity:44, digitalReadiness:42, telecomStrategy:46, digitalEconomy:38, aiReadiness:38,  dataCenters:28,  digitalInfra:42, space:22,  innovation:38 },
  { id:"DZA", name:"Algeria",              region:"MENA",          gdp:28,  digitalMaturity:38, digitalReadiness:35, telecomStrategy:40, digitalEconomy:32, aiReadiness:34,  dataCenters:22,  digitalInfra:36, space:25,  innovation:30 },
  { id:"LBY", name:"Libya",                region:"MENA",          gdp:20,  digitalMaturity:28, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:28, space:NA,  innovation:NA  },
  { id:"LBN", name:"Lebanon",              region:"MENA",          gdp:12,  digitalMaturity:40, digitalReadiness:38, telecomStrategy:35, digitalEconomy:30, aiReadiness:35,  dataCenters:22,  digitalInfra:38, space:18,  innovation:32 },
  { id:"IRQ", name:"Iraq",                 region:"MENA",          gdp:28,  digitalMaturity:30, digitalReadiness:28, telecomStrategy:32, digitalEconomy:25, aiReadiness:28,  dataCenters:18,  digitalInfra:28, space:15,  innovation:22 },
  { id:"SYR", name:"Syria",                region:"MENA",          gdp:10,  digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"YEM", name:"Yemen",                region:"MENA",          gdp:8,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"PSE", name:"Palestine",            region:"MENA",          gdp:8,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"IRN", name:"Iran",                 region:"MENA",          gdp:35,  digitalMaturity:42, digitalReadiness:40, telecomStrategy:45, digitalEconomy:35, aiReadiness:38,  dataCenters:28,  digitalInfra:40, space:40,  innovation:35 },
  { id:"SGP", name:"Singapore",            region:"Asia-Pacific",  gdp:40,  digitalMaturity:94, digitalReadiness:92, telecomStrategy:93, digitalEconomy:93, aiReadiness:90,  dataCenters:85,  digitalInfra:95, space:62,  innovation:91 },
  { id:"NZL", name:"New Zealand",          region:"Asia-Pacific",  gdp:35,  digitalMaturity:80, digitalReadiness:78, telecomStrategy:74, digitalEconomy:73, aiReadiness:76,  dataCenters:58,  digitalInfra:75, space:48,  innovation:74 },
  { id:"MYS", name:"Malaysia",             region:"Asia-Pacific",  gdp:38,  digitalMaturity:68, digitalReadiness:65, telecomStrategy:70, digitalEconomy:63, aiReadiness:64,  dataCenters:58,  digitalInfra:66, space:48,  innovation:62 },
  { id:"THA", name:"Thailand",             region:"Asia-Pacific",  gdp:40,  digitalMaturity:60, digitalReadiness:57, telecomStrategy:63, digitalEconomy:56, aiReadiness:58,  dataCenters:52,  digitalInfra:60, space:42,  innovation:55 },
  { id:"VNM", name:"Vietnam",              region:"Asia-Pacific",  gdp:35,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:60, digitalEconomy:50, aiReadiness:52,  dataCenters:45,  digitalInfra:55, space:38,  innovation:50 },
  { id:"PHL", name:"Philippines",          region:"Asia-Pacific",  gdp:35,  digitalMaturity:50, digitalReadiness:47, telecomStrategy:52, digitalEconomy:46, aiReadiness:48,  dataCenters:40,  digitalInfra:50, space:32,  innovation:46 },
  { id:"PAK", name:"Pakistan",             region:"Asia-Pacific",  gdp:32,  digitalMaturity:38, digitalReadiness:35, telecomStrategy:42, digitalEconomy:32, aiReadiness:35,  dataCenters:28,  digitalInfra:36, space:30,  innovation:34 },
  { id:"BGD", name:"Bangladesh",           region:"Asia-Pacific",  gdp:30,  digitalMaturity:35, digitalReadiness:32, telecomStrategy:40, digitalEconomy:28, aiReadiness:30,  dataCenters:22,  digitalInfra:33, space:22,  innovation:32 },
  { id:"KAZ", name:"Kazakhstan",           region:"Asia-Pacific",  gdp:30,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:60, digitalEconomy:48, aiReadiness:50,  dataCenters:42,  digitalInfra:53, space:48,  innovation:48 },
  { id:"TWN", name:"Taiwan",               region:"Asia-Pacific",  gdp:55,  digitalMaturity:88, digitalReadiness:86, telecomStrategy:84, digitalEconomy:84, aiReadiness:82,  dataCenters:78,  digitalInfra:90, space:65,  innovation:88 },
  { id:"HKG", name:"Hong Kong",            region:"Asia-Pacific",  gdp:38,  digitalMaturity:88, digitalReadiness:86, telecomStrategy:82, digitalEconomy:87, aiReadiness:82,  dataCenters:80,  digitalInfra:90, space:45,  innovation:82 },
  { id:"MMR", name:"Myanmar",              region:"Asia-Pacific",  gdp:18,  digitalMaturity:28, digitalReadiness:25, telecomStrategy:30, digitalEconomy:20, aiReadiness:22,  dataCenters:12,  digitalInfra:25, space:12,  innovation:20 },
  { id:"KHM", name:"Cambodia",             region:"Asia-Pacific",  gdp:14,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:35, digitalEconomy:26, aiReadiness:28,  dataCenters:15,  digitalInfra:30, space:10,  innovation:24 },
  { id:"LAO", name:"Laos",                 region:"Asia-Pacific",  gdp:12,  digitalMaturity:30, digitalReadiness:28, telecomStrategy:32, digitalEconomy:22, aiReadiness:24,  dataCenters:12,  digitalInfra:28, space:10,  innovation:20 },
  { id:"NPL", name:"Nepal",                region:"Asia-Pacific",  gdp:10,  digitalMaturity:30, digitalReadiness:28, telecomStrategy:32, digitalEconomy:24, aiReadiness:25,  dataCenters:12,  digitalInfra:28, space:10,  innovation:22 },
  { id:"LKA", name:"Sri Lanka",            region:"Asia-Pacific",  gdp:16,  digitalMaturity:40, digitalReadiness:38, telecomStrategy:42, digitalEconomy:35, aiReadiness:36,  dataCenters:22,  digitalInfra:38, space:18,  innovation:34 },
  { id:"MDV", name:"Maldives",             region:"Asia-Pacific",  gdp:8,   digitalMaturity:45, digitalReadiness:42, telecomStrategy:45, digitalEconomy:40, aiReadiness:35,  dataCenters:18,  digitalInfra:43, space:NA,  innovation:28 },
  { id:"BTN", name:"Bhutan",               region:"Asia-Pacific",  gdp:7,   digitalMaturity:30, digitalReadiness:28, telecomStrategy:32, digitalEconomy:25, aiReadiness:24,  dataCenters:10,  digitalInfra:28, space:NA,  innovation:20 },
  { id:"AFG", name:"Afghanistan",          region:"Asia-Pacific",  gdp:8,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"UZB", name:"Uzbekistan",           region:"Asia-Pacific",  gdp:22,  digitalMaturity:45, digitalReadiness:42, telecomStrategy:48, digitalEconomy:38, aiReadiness:40,  dataCenters:25,  digitalInfra:43, space:28,  innovation:36 },
  { id:"TKM", name:"Turkmenistan",         region:"Asia-Pacific",  gdp:16,  digitalMaturity:28, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:25, space:NA,  innovation:NA  },
  { id:"TJK", name:"Tajikistan",           region:"Asia-Pacific",  gdp:8,   digitalMaturity:28, digitalReadiness:25, telecomStrategy:28, digitalEconomy:20, aiReadiness:20,  dataCenters:10,  digitalInfra:24, space:10,  innovation:18 },
  { id:"KGZ", name:"Kyrgyzstan",           region:"Asia-Pacific",  gdp:8,   digitalMaturity:32, digitalReadiness:30, telecomStrategy:32, digitalEconomy:24, aiReadiness:25,  dataCenters:12,  digitalInfra:30, space:10,  innovation:20 },
  { id:"MNG", name:"Mongolia",             region:"Asia-Pacific",  gdp:10,  digitalMaturity:38, digitalReadiness:35, telecomStrategy:40, digitalEconomy:30, aiReadiness:30,  dataCenters:15,  digitalInfra:35, space:15,  innovation:26 },
  { id:"PNG", name:"Papua New Guinea",     region:"Asia-Pacific",  gdp:12,  digitalMaturity:22, digitalReadiness:20, telecomStrategy:22, digitalEconomy:16, aiReadiness:16,  dataCenters:8,   digitalInfra:18, space:NA,  innovation:14 },
  { id:"FJI", name:"Fiji",                 region:"Asia-Pacific",  gdp:6,   digitalMaturity:38, digitalReadiness:35, telecomStrategy:38, digitalEconomy:30, aiReadiness:28,  dataCenters:12,  digitalInfra:35, space:NA,  innovation:24 },
  { id:"WSM", name:"Samoa",                region:"Asia-Pacific",  gdp:3,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"TON", name:"Tonga",                region:"Asia-Pacific",  gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"VUT", name:"Vanuatu",              region:"Asia-Pacific",  gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"SLB", name:"Solomon Islands",      region:"Asia-Pacific",  gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"KIR", name:"Kiribati",             region:"Asia-Pacific",  gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"FSM", name:"Micronesia",           region:"Asia-Pacific",  gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"MHL", name:"Marshall Islands",     region:"Asia-Pacific",  gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"PLW", name:"Palau",                region:"Asia-Pacific",  gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"NRU", name:"Nauru",                region:"Asia-Pacific",  gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"TUV", name:"Tuvalu",               region:"Asia-Pacific",  gdp:NA,  digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"PRK", name:"North Korea",          region:"Asia-Pacific",  gdp:NA,  digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:30,  innovation:NA  },
  { id:"COL", name:"Colombia",             region:"Americas",      gdp:35,  digitalMaturity:48, digitalReadiness:45, telecomStrategy:48, digitalEconomy:43, aiReadiness:45,  dataCenters:38,  digitalInfra:46, space:32,  innovation:44 },
  { id:"CHL", name:"Chile",                region:"Americas",      gdp:32,  digitalMaturity:55, digitalReadiness:52, telecomStrategy:55, digitalEconomy:50, aiReadiness:52,  dataCenters:42,  digitalInfra:53, space:38,  innovation:54 },
  { id:"PER", name:"Peru",                 region:"Americas",      gdp:28,  digitalMaturity:45, digitalReadiness:42, telecomStrategy:44, digitalEconomy:40, aiReadiness:42,  dataCenters:32,  digitalInfra:43, space:30,  innovation:40 },
  { id:"VEN", name:"Venezuela",            region:"Americas",      gdp:18,  digitalMaturity:30, digitalReadiness:28, telecomStrategy:28, digitalEconomy:22, aiReadiness:25,  dataCenters:12,  digitalInfra:28, space:20,  innovation:20 },
  { id:"ECU", name:"Ecuador",              region:"Americas",      gdp:20,  digitalMaturity:42, digitalReadiness:40, telecomStrategy:42, digitalEconomy:36, aiReadiness:38,  dataCenters:22,  digitalInfra:40, space:18,  innovation:32 },
  { id:"BOL", name:"Bolivia",              region:"Americas",      gdp:14,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:32, digitalEconomy:26, aiReadiness:28,  dataCenters:15,  digitalInfra:30, space:14,  innovation:24 },
  { id:"PRY", name:"Paraguay",             region:"Americas",      gdp:12,  digitalMaturity:35, digitalReadiness:32, telecomStrategy:34, digitalEconomy:28, aiReadiness:30,  dataCenters:15,  digitalInfra:32, space:12,  innovation:26 },
  { id:"URY", name:"Uruguay",              region:"Americas",      gdp:18,  digitalMaturity:62, digitalReadiness:60, telecomStrategy:60, digitalEconomy:56, aiReadiness:55,  dataCenters:35,  digitalInfra:60, space:25,  innovation:52 },
  { id:"CRI", name:"Costa Rica",           region:"Americas",      gdp:14,  digitalMaturity:52, digitalReadiness:50, telecomStrategy:52, digitalEconomy:46, aiReadiness:48,  dataCenters:28,  digitalInfra:50, space:20,  innovation:46 },
  { id:"PAN", name:"Panama",               region:"Americas",      gdp:16,  digitalMaturity:50, digitalReadiness:48, telecomStrategy:50, digitalEconomy:46, aiReadiness:46,  dataCenters:32,  digitalInfra:48, space:18,  innovation:42 },
  { id:"GTM", name:"Guatemala",            region:"Americas",      gdp:14,  digitalMaturity:36, digitalReadiness:34, telecomStrategy:36, digitalEconomy:28, aiReadiness:30,  dataCenters:18,  digitalInfra:34, space:10,  innovation:24 },
  { id:"CUB", name:"Cuba",                 region:"Americas",      gdp:12,  digitalMaturity:25, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:22, space:NA,  innovation:NA  },
  { id:"DOM", name:"Dominican Republic",   region:"Americas",      gdp:16,  digitalMaturity:42, digitalReadiness:40, telecomStrategy:42, digitalEconomy:36, aiReadiness:36,  dataCenters:20,  digitalInfra:40, space:12,  innovation:30 },
  { id:"HTI", name:"Haiti",                region:"Americas",      gdp:6,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"HND", name:"Honduras",             region:"Americas",      gdp:10,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:32, digitalEconomy:25, aiReadiness:26,  dataCenters:12,  digitalInfra:30, space:8,   innovation:20 },
  { id:"SLV", name:"El Salvador",          region:"Americas",      gdp:10,  digitalMaturity:36, digitalReadiness:34, telecomStrategy:36, digitalEconomy:30, aiReadiness:30,  dataCenters:14,  digitalInfra:34, space:8,   innovation:24 },
  { id:"NIC", name:"Nicaragua",            region:"Americas",      gdp:8,   digitalMaturity:28, digitalReadiness:26, telecomStrategy:28, digitalEconomy:22, aiReadiness:22,  dataCenters:10,  digitalInfra:26, space:6,   innovation:18 },
  { id:"JAM", name:"Jamaica",              region:"Americas",      gdp:8,   digitalMaturity:42, digitalReadiness:40, telecomStrategy:40, digitalEconomy:35, aiReadiness:35,  dataCenters:15,  digitalInfra:40, space:10,  innovation:28 },
  { id:"TTO", name:"Trinidad & Tobago",    region:"Americas",      gdp:10,  digitalMaturity:45, digitalReadiness:42, telecomStrategy:44, digitalEconomy:38, aiReadiness:38,  dataCenters:18,  digitalInfra:42, space:12,  innovation:32 },
  { id:"GUY", name:"Guyana",               region:"Americas",      gdp:8,   digitalMaturity:35, digitalReadiness:32, telecomStrategy:34, digitalEconomy:28, aiReadiness:28,  dataCenters:12,  digitalInfra:32, space:8,   innovation:22 },
  { id:"SUR", name:"Suriname",             region:"Americas",      gdp:6,   digitalMaturity:32, digitalReadiness:30, telecomStrategy:30, digitalEconomy:24, aiReadiness:24,  dataCenters:10,  digitalInfra:28, space:6,   innovation:18 },
  { id:"BLZ", name:"Belize",               region:"Americas",      gdp:4,   digitalMaturity:35, digitalReadiness:32, telecomStrategy:32, digitalEconomy:26, aiReadiness:25,  dataCenters:8,   digitalInfra:30, space:NA,  innovation:18 },
  { id:"BHS", name:"Bahamas",              region:"Americas",      gdp:8,   digitalMaturity:48, digitalReadiness:45, telecomStrategy:44, digitalEconomy:40, aiReadiness:38,  dataCenters:15,  digitalInfra:45, space:NA,  innovation:28 },
  { id:"BRB", name:"Barbados",             region:"Americas",      gdp:5,   digitalMaturity:52, digitalReadiness:50, telecomStrategy:50, digitalEconomy:45, aiReadiness:42,  dataCenters:15,  digitalInfra:50, space:NA,  innovation:32 },
  { id:"LCA", name:"Saint Lucia",          region:"Americas",      gdp:3,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"VCT", name:"St. Vincent & Gren.",  region:"Americas",      gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"GRD", name:"Grenada",              region:"Americas",      gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"ATG", name:"Antigua & Barbuda",    region:"Americas",      gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"DMA", name:"Dominica",             region:"Americas",      gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"KNA", name:"Saint Kitts & Nevis",  region:"Americas",      gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"NGA", name:"Nigeria",              region:"Africa",        gdp:32,  digitalMaturity:35, digitalReadiness:32, telecomStrategy:38, digitalEconomy:30, aiReadiness:32,  dataCenters:28,  digitalInfra:32, space:25,  innovation:33 },
  { id:"KEN", name:"Kenya",                region:"Africa",        gdp:20,  digitalMaturity:42, digitalReadiness:40, telecomStrategy:48, digitalEconomy:38, aiReadiness:40,  dataCenters:32,  digitalInfra:40, space:28,  innovation:42 },
  { id:"ETH", name:"Ethiopia",             region:"Africa",        gdp:18,  digitalMaturity:28, digitalReadiness:25, telecomStrategy:35, digitalEconomy:22, aiReadiness:25,  dataCenters:18,  digitalInfra:25, space:18,  innovation:26 },
  { id:"GHA", name:"Ghana",                region:"Africa",        gdp:18,  digitalMaturity:38, digitalReadiness:35, telecomStrategy:40, digitalEconomy:32, aiReadiness:34,  dataCenters:25,  digitalInfra:35, space:20,  innovation:36 },
  { id:"TZA", name:"Tanzania",             region:"Africa",        gdp:16,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:35, digitalEconomy:26, aiReadiness:28,  dataCenters:18,  digitalInfra:30, space:14,  innovation:24 },
  { id:"COD", name:"DR Congo",             region:"Africa",        gdp:14,  digitalMaturity:20, digitalReadiness:18, telecomStrategy:22, digitalEconomy:14, aiReadiness:16,  dataCenters:8,   digitalInfra:18, space:8,   innovation:12 },
  { id:"UGA", name:"Uganda",               region:"Africa",        gdp:10,  digitalMaturity:28, digitalReadiness:26, telecomStrategy:30, digitalEconomy:20, aiReadiness:22,  dataCenters:12,  digitalInfra:26, space:10,  innovation:20 },
  { id:"SEN", name:"Senegal",              region:"Africa",        gdp:10,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:35, digitalEconomy:26, aiReadiness:28,  dataCenters:14,  digitalInfra:30, space:12,  innovation:24 },
  { id:"CIV", name:"Côte d'Ivoire",        region:"Africa",        gdp:12,  digitalMaturity:32, digitalReadiness:30, telecomStrategy:34, digitalEconomy:26, aiReadiness:28,  dataCenters:15,  digitalInfra:30, space:10,  innovation:22 },
  { id:"CMR", name:"Cameroon",             region:"Africa",        gdp:12,  digitalMaturity:28, digitalReadiness:26, telecomStrategy:30, digitalEconomy:22, aiReadiness:22,  dataCenters:10,  digitalInfra:26, space:8,   innovation:18 },
  { id:"AGO", name:"Angola",               region:"Africa",        gdp:16,  digitalMaturity:25, digitalReadiness:22, telecomStrategy:28, digitalEconomy:18, aiReadiness:20,  dataCenters:8,   digitalInfra:22, space:8,   innovation:14 },
  { id:"MOZ", name:"Mozambique",           region:"Africa",        gdp:8,   digitalMaturity:20, digitalReadiness:18, telecomStrategy:22, digitalEconomy:14, aiReadiness:15,  dataCenters:6,   digitalInfra:18, space:6,   innovation:12 },
  { id:"ZMB", name:"Zambia",               region:"Africa",        gdp:8,   digitalMaturity:25, digitalReadiness:22, telecomStrategy:26, digitalEconomy:18, aiReadiness:18,  dataCenters:8,   digitalInfra:22, space:6,   innovation:14 },
  { id:"ZWE", name:"Zimbabwe",             region:"Africa",        gdp:8,   digitalMaturity:28, digitalReadiness:25, telecomStrategy:28, digitalEconomy:20, aiReadiness:20,  dataCenters:8,   digitalInfra:24, space:8,   innovation:16 },
  { id:"MDG", name:"Madagascar",           region:"Africa",        gdp:6,   digitalMaturity:16, digitalReadiness:14, telecomStrategy:18, digitalEconomy:10, aiReadiness:12,  dataCenters:4,   digitalInfra:14, space:4,   innovation:8  },
  { id:"MLI", name:"Mali",                 region:"Africa",        gdp:6,   digitalMaturity:18, digitalReadiness:16, telecomStrategy:20, digitalEconomy:12, aiReadiness:12,  dataCenters:4,   digitalInfra:16, space:4,   innovation:8  },
  { id:"BFA", name:"Burkina Faso",         region:"Africa",        gdp:6,   digitalMaturity:16, digitalReadiness:14, telecomStrategy:18, digitalEconomy:10, aiReadiness:10,  dataCenters:4,   digitalInfra:14, space:4,   innovation:8  },
  { id:"GIN", name:"Guinea",               region:"Africa",        gdp:5,   digitalMaturity:16, digitalReadiness:14, telecomStrategy:18, digitalEconomy:10, aiReadiness:10,  dataCenters:4,   digitalInfra:14, space:4,   innovation:8  },
  { id:"NER", name:"Niger",                region:"Africa",        gdp:5,   digitalMaturity:12, digitalReadiness:10, telecomStrategy:14, digitalEconomy:8,  aiReadiness:8,   dataCenters:2,   digitalInfra:10, space:2,   innovation:6  },
  { id:"TCD", name:"Chad",                 region:"Africa",        gdp:5,   digitalMaturity:10, digitalReadiness:8,  telecomStrategy:12, digitalEconomy:6,  aiReadiness:6,   dataCenters:2,   digitalInfra:8,  space:2,   innovation:4  },
  { id:"RWA", name:"Rwanda",               region:"Africa",        gdp:6,   digitalMaturity:38, digitalReadiness:35, telecomStrategy:42, digitalEconomy:30, aiReadiness:32,  dataCenters:15,  digitalInfra:36, space:12,  innovation:28 },
  { id:"BWA", name:"Botswana",             region:"Africa",        gdp:8,   digitalMaturity:38, digitalReadiness:35, telecomStrategy:40, digitalEconomy:32, aiReadiness:32,  dataCenters:15,  digitalInfra:36, space:12,  innovation:30 },
  { id:"NAM", name:"Namibia",              region:"Africa",        gdp:8,   digitalMaturity:35, digitalReadiness:32, telecomStrategy:36, digitalEconomy:28, aiReadiness:28,  dataCenters:10,  digitalInfra:32, space:10,  innovation:24 },
  { id:"MUS", name:"Mauritius",            region:"Africa",        gdp:8,   digitalMaturity:58, digitalReadiness:55, telecomStrategy:58, digitalEconomy:52, aiReadiness:50,  dataCenters:28,  digitalInfra:56, space:18,  innovation:48 },
  { id:"SSD", name:"South Sudan",          region:"Africa",        gdp:4,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"ERI", name:"Eritrea",              region:"Africa",        gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"SOM", name:"Somalia",              region:"Africa",        gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"LBR", name:"Liberia",              region:"Africa",        gdp:2,   digitalMaturity:16, digitalReadiness:14, telecomStrategy:18, digitalEconomy:10, aiReadiness:10,  dataCenters:4,   digitalInfra:12, space:2,   innovation:6  },
  { id:"SLE", name:"Sierra Leone",         region:"Africa",        gdp:3,   digitalMaturity:18, digitalReadiness:16, telecomStrategy:20, digitalEconomy:12, aiReadiness:12,  dataCenters:4,   digitalInfra:14, space:2,   innovation:8  },
  { id:"TGO", name:"Togo",                 region:"Africa",        gdp:4,   digitalMaturity:22, digitalReadiness:20, telecomStrategy:24, digitalEconomy:15, aiReadiness:15,  dataCenters:5,   digitalInfra:18, space:4,   innovation:12 },
  { id:"BEN", name:"Benin",                region:"Africa",        gdp:5,   digitalMaturity:22, digitalReadiness:20, telecomStrategy:25, digitalEconomy:16, aiReadiness:16,  dataCenters:5,   digitalInfra:19, space:4,   innovation:12 },
  { id:"MRT", name:"Mauritania",           region:"Africa",        gdp:4,   digitalMaturity:20, digitalReadiness:18, telecomStrategy:22, digitalEconomy:14, aiReadiness:14,  dataCenters:4,   digitalInfra:17, space:4,   innovation:10 },
  { id:"GMB", name:"Gambia",               region:"Africa",        gdp:2,   digitalMaturity:20, digitalReadiness:18, telecomStrategy:22, digitalEconomy:14, aiReadiness:14,  dataCenters:4,   digitalInfra:17, space:2,   innovation:10 },
  { id:"GNB", name:"Guinea-Bissau",        region:"Africa",        gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"CPV", name:"Cape Verde",           region:"Africa",        gdp:2,   digitalMaturity:40, digitalReadiness:38, telecomStrategy:40, digitalEconomy:32, aiReadiness:30,  dataCenters:8,   digitalInfra:38, space:NA,  innovation:24 },
  { id:"STP", name:"São Tomé & Príncipe",  region:"Africa",        gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"GNQ", name:"Equatorial Guinea",    region:"Africa",        gdp:5,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"GAB", name:"Gabon",                region:"Africa",        gdp:8,   digitalMaturity:30, digitalReadiness:28, telecomStrategy:30, digitalEconomy:22, aiReadiness:22,  dataCenters:8,   digitalInfra:26, space:6,   innovation:16 },
  { id:"COG", name:"Republic of Congo",    region:"Africa",        gdp:6,   digitalMaturity:22, digitalReadiness:20, telecomStrategy:22, digitalEconomy:14, aiReadiness:14,  dataCenters:4,   digitalInfra:18, space:4,   innovation:10 },
  { id:"CAF", name:"Central African Rep.", region:"Africa",        gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"BDI", name:"Burundi",              region:"Africa",        gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"COM", name:"Comoros",              region:"Africa",        gdp:1,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"SWZ", name:"Eswatini",             region:"Africa",        gdp:3,   digitalMaturity:28, digitalReadiness:25, telecomStrategy:28, digitalEconomy:20, aiReadiness:18,  dataCenters:5,   digitalInfra:24, space:NA,  innovation:14 },
  { id:"LSO", name:"Lesotho",              region:"Africa",        gdp:2,   digitalMaturity:NA, digitalReadiness:NA, telecomStrategy:NA, digitalEconomy:NA, aiReadiness:NA,  dataCenters:NA,  digitalInfra:NA, space:NA,  innovation:NA  },
  { id:"MWI", name:"Malawi",               region:"Africa",        gdp:3,   digitalMaturity:18, digitalReadiness:16, telecomStrategy:20, digitalEconomy:12, aiReadiness:12,  dataCenters:4,   digitalInfra:14, space:4,   innovation:8  },
  { id:"DJI", name:"Djibouti",             region:"Africa",        gdp:3,   digitalMaturity:28, digitalReadiness:26, telecomStrategy:30, digitalEconomy:22, aiReadiness:22,  dataCenters:8,   digitalInfra:26, space:8,   innovation:16 },
  { id:"SDN", name:"Sudan",                region:"Africa",        gdp:8,   digitalMaturity:20, digitalReadiness:18, telecomStrategy:22, digitalEconomy:14, aiReadiness:14,  dataCenters:4,   digitalInfra:17, space:6,   innovation:10 },
];

const INDICATORS = [
  { key:"gdp",             label:"GDP",                    color:"#3B82F6", source:"IMF WEO 2024",               description:"Gross Domestic Product (PPP, normalised to 0–100). Proxy for economic scale and capacity to invest in digital infrastructure and international cooperation." },
  { key:"digitalMaturity", label:"Digital Maturity",       color:"#8B5CF6", source:"ITU IDI 2024",               description:"ITU ICT Development Index — measures ICT access, use and skills across 167 countries. Scores normalised from the original 0–10 scale." },
  { key:"digitalReadiness",label:"Digital Readiness",      color:"#06B6D4", source:"WEF GCI 2024",               description:"WEF Global Competitiveness Index digital component — ICT adoption, digital-skills readiness, and innovation capacity." },
  { key:"telecomStrategy", label:"Telecom Strategy",       color:"#10B981", source:"ITU Regulatory Tracker 2024", description:"ITU Regulatory Tracker — maturity of national telecom regulatory frameworks, spectrum management, and digital policy environments." },
  { key:"digitalEconomy",  label:"Digital Economy",        color:"#F59E0B", source:"IMD WDC 2024",               description:"IMD World Digital Competitiveness Ranking — technology, knowledge, and future-readiness. Covers 64 economies annually." },
  { key:"aiReadiness",     label:"AI Readiness",           color:"#EF4444", source:"Oxford AI Readiness 2024",   description:"Oxford Insights Government AI Readiness Index — government capacity to implement AI services across 193 countries." },
  { key:"dataCenters",     label:"Data Centers",           color:"#F97316", source:"DC Map / Cloudscene 2024",   description:"Data centre market size, capacity and density score derived from DC Map and Cloudscene facility databases. Reflects cloud infrastructure maturity." },
  { key:"digitalInfra",   label:"Digital Infrastructure",  color:"#14B8A6", source:"GSMA Connectivity 2024",    description:"GSMA Mobile Connectivity Index — infrastructure, affordability, consumer readiness and content across 165 countries." },
  { key:"space",           label:"Space",                   color:"#6366F1", source:"UCS / ESA Satellite 2024",  description:"Composite space sector score based on active satellite assets (UCS database), national space agency capability, launch activity and space economy participation." },
  { key:"innovation",      label:"Innovation",              color:"#EC4899", source:"GII 2024",                  description:"Global Innovation Index — institutions, human capital, infrastructure, market sophistication, business sophistication and creative outputs across 133 economies." },
];

const INTERNAL_CRITERIA = [
  { key:"leadershipInterest",   label:"Country's Leadership Interest",                         color:"#22C55E" },
  { key:"internalStakeholders", label:"Interest & Needs from Country's Internal Stakeholders",  color:"#A855F7" },
  { key:"foreignStakeholders",  label:"Interest & Needs from Foreign Stakeholders",             color:"#F59E0B" },
];

const SCORE_LABELS = { 1:"Minimal", 2:"Low", 3:"Medium", 4:"High", 5:"Strategic" };
const REGIONS = ["All","MENA","Europe","Asia-Pacific","Americas","Africa"];
const INT_WEIGHT = 0.30 / INTERNAL_CRITERIA.length;

function coverageCount(c) { return INDICATORS.filter(ind => c[ind.key] !== null).length; }

function calcScore(c, internal) {
  const cov = coverageCount(c);
  const extAvg = cov > 0 ? INDICATORS.filter(ind => c[ind.key] !== null).reduce((s, ind) => s + c[ind.key], 0) / cov : 0;
  const extScore = extAvg * 0.70;
  const intScore = INTERNAL_CRITERIA.reduce((s, ic) => s + ((internal[c.id]?.[ic.key] ?? 3) * 20) * INT_WEIGHT, 0);
  return Math.round(extScore + intScore);
}

function scoreColor(s) { return s>=80?"#22C55E":s>=65?"#84CC16":s>=50?"#F59E0B":s>=35?"#F97316":"#EF4444"; }
function scoreLabel(s) { return s>=80?"Strategic":s>=65?"High":s>=50?"Medium":s>=35?"Low":"Minimal"; }

const MAP_POS = {
  USA:{x:150,y:178}, CHN:{x:620,y:193}, DEU:{x:450,y:143}, GBR:{x:430,y:133}, JPN:{x:688,y:188},
  FRA:{x:440,y:153}, KOR:{x:673,y:188}, CAN:{x:155,y:133}, AUS:{x:665,y:338}, IND:{x:590,y:223},
  BRA:{x:230,y:303}, ITA:{x:460,y:163}, NLD:{x:447,y:137}, ESP:{x:430,y:163}, CHE:{x:453,y:149},
  SWE:{x:465,y:118}, SGP:{x:645,y:267}, ARE:{x:545,y:218}, ISR:{x:502,y:193}, FIN:{x:472,y:108},
  DNK:{x:456,y:126}, NOR:{x:455,y:112}, NZL:{x:718,y:368}, AUT:{x:460,y:147}, BEL:{x:445,y:139},
  POL:{x:466,y:137}, TUR:{x:500,y:173}, MEX:{x:160,y:216}, ARG:{x:215,y:358}, ZAF:{x:482,y:358},
  NGA:{x:460,y:273}, EGY:{x:498,y:203}, QAT:{x:534,y:217}, KWT:{x:529,y:209}, BHR:{x:532,y:214},
  OMN:{x:547,y:227}, JOR:{x:505,y:199}, MAR:{x:427,y:203}, KEN:{x:510,y:283}, ETH:{x:512,y:268},
  GHA:{x:439,y:271}, IDN:{x:647,y:283}, MYS:{x:637,y:267}, THA:{x:630,y:249}, VNM:{x:641,y:246},
  PHL:{x:659,y:254}, PAK:{x:572,y:209}, BGD:{x:600,y:224}, RUS:{x:568,y:119}, UKR:{x:489,y:147},
  CZE:{x:463,y:142}, HUN:{x:467,y:147}, GRC:{x:471,y:169}, PRT:{x:424,y:162}, IRE:{x:422,y:131},
  LUX:{x:449,y:142}, COL:{x:194,y:267}, CHL:{x:205,y:348}, PER:{x:194,y:294}, KAZ:{x:569,y:157},
  SAU:{x:527,y:221}, TWN:{x:659,y:209}, HKG:{x:648,y:212}, ROU:{x:477,y:154}, SVK:{x:465,y:144},
  BGR:{x:475,y:159}, HRV:{x:460,y:157}, SVN:{x:457,y:152}, LTU:{x:470,y:129}, LVA:{x:470,y:126},
  EST:{x:472,y:121}, BLR:{x:480,y:137}, SRB:{x:467,y:157}, MKD:{x:468,y:162}, ALB:{x:463,y:164},
  BIH:{x:461,y:159}, MDA:{x:480,y:149}, MNE:{x:461,y:161}, ISL:{x:415,y:107}, CYP:{x:492,y:177},
  MLT:{x:460,y:174}, GEO:{x:508,y:162}, ARM:{x:513,y:167}, AZE:{x:518,y:164}, IRN:{x:548,y:194},
  IRQ:{x:524,y:197}, SYR:{x:510,y:187}, LBN:{x:504,y:191}, PSE:{x:500,y:195}, YEM:{x:537,y:239},
  DZA:{x:440,y:197}, TUN:{x:452,y:182}, LBY:{x:465,y:199}, TZA:{x:504,y:294}, COD:{x:476,y:297},
  UGA:{x:502,y:283}, SEN:{x:424,y:251}, CIV:{x:431,y:267}, CMR:{x:461,y:269}, AGO:{x:467,y:317},
  MOZ:{x:499,y:329}, ZMB:{x:487,y:319}, ZWE:{x:491,y:334}, MDG:{x:519,y:334}, MLI:{x:434,y:244},
  BFA:{x:439,y:254}, GIN:{x:421,y:257}, NER:{x:451,y:244}, TCD:{x:464,y:254}, RWA:{x:497,y:294},
  BWA:{x:482,y:344}, NAM:{x:469,y:344}, MUS:{x:529,y:339}, SSD:{x:497,y:271}, ERI:{x:512,y:254},
  SOM:{x:521,y:269}, LBR:{x:421,y:267}, SLE:{x:417,y:262}, TGO:{x:444,y:264}, BEN:{x:447,y:262},
  MRT:{x:419,y:234}, GMB:{x:415,y:252}, CPV:{x:404,y:242}, GAB:{x:459,y:281}, COG:{x:461,y:287},
  UZB:{x:571,y:166}, TJK:{x:579,y:174}, KGZ:{x:584,y:167}, MNG:{x:619,y:162}, MMR:{x:621,y:239},
  KHM:{x:634,y:252}, LAO:{x:629,y:244}, LKA:{x:591,y:251}, NPL:{x:595,y:217}, BTN:{x:601,y:211},
  MDV:{x:579,y:267}, AFG:{x:569,y:197}, PRK:{x:667,y:184}, PNG:{x:689,y:299}, FJI:{x:718,y:324},
  VEN:{x:209,y:257}, ECU:{x:184,y:274}, BOL:{x:206,y:317}, PRY:{x:217,y:334}, URY:{x:221,y:351},
  CRI:{x:174,y:237}, PAN:{x:181,y:242}, GTM:{x:161,y:227}, HND:{x:167,y:231}, SLV:{x:162,y:231},
  NIC:{x:169,y:235}, CUB:{x:187,y:217}, DOM:{x:196,y:219}, JAM:{x:189,y:224}, TTO:{x:217,y:254},
  GUY:{x:222,y:262}, SUR:{x:227,y:259}, BLZ:{x:164,y:223}, BHS:{x:189,y:206}, BRB:{x:221,y:247},
  TKM:{x:558,y:169}, DJI:{x:519,y:262}, SDN:{x:499,y:257}, MWI:{x:498,y:317}, SWZ:{x:494,y:347},
};

const thStyle = { padding:"9px 12px", textAlign:"left", fontSize:10, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" };
const tdStyle = { padding:"9px 12px", fontSize:12 };



// ISO numeric to our country ID
const ISO_NUM = {"4":"AFG","8":"ALB","12":"DZA","24":"AGO","32":"ARG","36":"AUS","40":"AUT","31":"AZE","48":"BHR","50":"BGD","56":"BEL","84":"BLZ","204":"BEN","64":"BTN","68":"BOL","70":"BIH","72":"BWA","76":"BRA","100":"BGR","854":"BFA","108":"BDI","116":"KHM","120":"CMR","124":"CAN","132":"CPV","140":"CAF","144":"LKA","152":"CHL","156":"CHN","170":"COL","174":"COM","180":"COD","178":"COG","188":"CRI","191":"HRV","192":"CUB","196":"CYP","203":"CZE","208":"DNK","262":"DJI","214":"DOM","218":"ECU","818":"EGY","222":"SLV","226":"GNQ","232":"ERI","233":"EST","231":"ETH","242":"FJI","246":"FIN","250":"FRA","266":"GAB","270":"GMB","268":"GEO","276":"DEU","288":"GHA","300":"GRC","320":"GTM","324":"GIN","624":"GNB","328":"GUY","332":"HTI","340":"HND","348":"HUN","356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","388":"JAM","392":"JPN","400":"JOR","398":"KAZ","404":"KEN","408":"PRK","410":"KOR","414":"KWT","417":"KGZ","418":"LAO","428":"LVA","422":"LBN","426":"LSO","430":"LBR","434":"LBY","440":"LTU","442":"LUX","450":"MDG","454":"MWI","458":"MYS","462":"MDV","466":"MLI","470":"MLT","478":"MRT","480":"MUS","484":"MEX","498":"MDA","496":"MNG","504":"MAR","508":"MOZ","104":"MMR","516":"NAM","524":"NPL","528":"NLD","554":"NZL","558":"NIC","562":"NER","566":"NGA","578":"NOR","512":"OMN","586":"PAK","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT","634":"QAT","642":"ROU","643":"RUS","646":"RWA","682":"SAU","686":"SEN","694":"SLE","703":"SVK","705":"SVN","706":"SOM","710":"ZAF","724":"ESP","729":"SDN","740":"SUR","752":"SWE","756":"CHE","760":"SYR","762":"TJK","764":"THA","768":"TGO","780":"TTO","788":"TUN","792":"TUR","795":"TKM","800":"UGA","804":"UKR","784":"ARE","826":"GBR","840":"USA","858":"URY","860":"UZB","548":"VUT","862":"VEN","704":"VNM","887":"YEM","894":"ZMB","716":"ZWE","275":"PSE","158":"TWN","344":"HKG"};

function WorldMap({ scored, internal, sel, setSel, calcScore, scoreColor, scoreLabel }) {
  const svgRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const scoredMap = useMemo(() => {
    const m = {};
    COUNTRIES.forEach(c => { m[c.id] = calcScore(c, internal); });
    return m;
  }, [internal, calcScore]);

  const filteredIds = useMemo(() => new Set(scored.map(c => c.id)), [scored]);

  // Load topojson once
  useEffect(() => {
    const topoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
    const topoClientUrl = "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js";

    // Inject topojson-client script if not already present
    const load = () => {
      d3.json(topoUrl).then(world => {
        const topo = window.topojson;
        if (!topo) return;
        const countries = topo.feature(world, world.objects.countries);
        const borders = topo.mesh(world, world.objects.countries, (a,b) => a !== b);
        setGeo({ countries, borders });
      }).catch(console.error);
    };

    if (window.topojson) { load(); return; }
    const script = document.createElement("script");
    script.src = topoClientUrl;
    script.onload = load;
    document.head.appendChild(script);
  }, []);

  // Render with d3 whenever geo or scores change
  useEffect(() => {
    if (!geo || !svgRef.current) return;
    const container = svgRef.current;
    const W = container.clientWidth || 900;
    const H = Math.round(W * 0.5);

    const svg = d3.select(container);
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const proj = d3.geoNaturalEarth1()
      .scale(W / 6.28)
      .translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);

    // Clear and rebuild
    svg.selectAll("*").remove();

    // Defs
    const defs = svg.append("defs");
    const grad = defs.append("radialGradient").attr("id","wm-ocean").attr("cx","50%").attr("cy","50%").attr("r","70%");
    grad.append("stop").attr("offset","0%").attr("stop-color","#0A1628");
    grad.append("stop").attr("offset","100%").attr("stop-color","#040A14");
    const glow = defs.append("filter").attr("id","wm-glow").attr("x","-50%").attr("y","-50%").attr("width","200%").attr("height","200%");
    glow.append("feGaussianBlur").attr("in","SourceGraphic").attr("stdDeviation","4").attr("result","blur");
    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in","blur");
    merge.append("feMergeNode").attr("in","SourceGraphic");

    // Ocean
    svg.append("rect").attr("width",W).attr("height",H).attr("fill","url(#wm-ocean)");
    svg.append("path").datum({type:"Sphere"}).attr("d",path)
      .attr("fill","none").attr("stroke","rgba(100,160,255,0.06)").attr("stroke-width",1);

    // Graticule
    const grat = d3.geoGraticule().step([30,30])();
    svg.append("path").datum(grat).attr("d",path)
      .attr("fill","none").attr("stroke","rgba(100,160,255,0.06)").attr("stroke-width",0.5);

    // Country fills
    svg.append("g").selectAll("path")
      .data(geo.countries.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const cid = ISO_NUM[String(d.id)];
        if (!cid) return "#152030";
        const inFilter = filteredIds.has(cid);
        if (!inFilter) return "#152030";
        const score = scoredMap[cid];
        return scoreColor(score) + (cid === sel ? "CC" : "55");
      })
      .attr("stroke", "none");

    // Country borders
    svg.append("path").datum(geo.borders).attr("d",path)
      .attr("fill","none")
      .attr("stroke","rgba(255,255,255,0.13)")
      .attr("stroke-width",0.5);

    // Sphere outline
    svg.append("path").datum({type:"Sphere"}).attr("d",path)
      .attr("fill","none").attr("stroke","rgba(255,255,255,0.1)").attr("stroke-width",0.8);

    // Hover/click layer
    svg.append("g").selectAll("path")
      .data(geo.countries.features)
      .join("path")
      .attr("d", path)
      .attr("fill", "transparent")
      .attr("stroke", d => {
        const cid = ISO_NUM[String(d.id)];
        return cid === sel ? scoreColor(scoredMap[cid] || 0) : "none";
      })
      .attr("stroke-width", 2)
      .style("cursor", d => ISO_NUM[String(d.id)] ? "pointer" : "default")
      .on("mouseover", function(event, d) {
        const cid = ISO_NUM[String(d.id)];
        const c = COUNTRIES.find(x => x.id === cid);
        if (!c || !filteredIds.has(cid)) return;
        const score = scoredMap[cid];
        d3.select(this.parentNode).selectAll("path")
          .filter(dd => ISO_NUM[String(dd.id)] === cid)
          .attr("fill", scoreColor(score) + "99");
        const [mx, my] = d3.pointer(event, container);
        setTooltip({ x: mx, y: my, name: c.name, score, region: c.region });
      })
      .on("mousemove", function(event) {
        const [mx, my] = d3.pointer(event, container);
        setTooltip(t => t ? {...t, x: mx, y: my} : t);
      })
      .on("mouseout", function(event, d) {
        const cid = ISO_NUM[String(d.id)];
        if (!cid) return;
        const inFilter = filteredIds.has(cid);
        const score = scoredMap[cid];
        d3.select(this.parentNode).selectAll("path")
          .filter(dd => ISO_NUM[String(dd.id)] === cid)
          .attr("fill", () => {
            if (!inFilter) return "#152030";
            return scoreColor(score) + (cid === sel ? "CC" : "55");
          });
        setTooltip(null);
      })
      .on("click", (event, d) => {
        const cid = ISO_NUM[String(d.id)];
        if (cid && COUNTRIES.find(x => x.id === cid)) setSel(cid === sel ? null : cid);
      });

    // Selected country pulse ring
    if (sel) {
      const selFeature = geo.countries.features.find(d => ISO_NUM[String(d.id)] === sel);
      if (selFeature) {
        const centroid = path.centroid(selFeature);
        const color = scoreColor(scoredMap[sel] || 0);
        if (!isNaN(centroid[0])) {
          svg.append("circle").attr("cx",centroid[0]).attr("cy",centroid[1]).attr("r",18)
            .attr("fill",color).attr("opacity",0.12).attr("pointer-events","none");
          svg.append("circle").attr("cx",centroid[0]).attr("cy",centroid[1]).attr("r",12)
            .attr("fill","none").attr("stroke",color).attr("stroke-width",2).attr("opacity",0.5).attr("pointer-events","none");
          svg.append("circle").attr("cx",centroid[0]).attr("cy",centroid[1]).attr("r",5)
            .attr("fill",color).attr("filter","url(#wm-glow)").attr("pointer-events","none");
        }
      }
    }

  }, [geo, scoredMap, filteredIds, sel]);

  return (
    <div style={{background:"#040A14",borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",overflow:"hidden",position:"relative"}}>
      {!geo && (
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
          <div style={{width:36,height:36,border:"3px solid rgba(14,165,233,0.3)",borderTopColor:"#0EA5E9",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
          <div style={{color:"#475569",fontSize:12}}>Loading world map…</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      <svg ref={svgRef} style={{width:"100%",display:"block",minHeight:420}}/>
      {tooltip && (
        <div style={{
          position:"absolute",pointerEvents:"none",
          left: Math.min(tooltip.x+14, (svgRef.current?.clientWidth||900)-200),
          top: Math.max(tooltip.y-65,8),
          background:"rgba(4,10,22,0.97)",
          border:`1px solid ${scoreColor(tooltip.score)}`,
          borderRadius:8,padding:"10px 14px",zIndex:20,
          boxShadow:`0 0 20px ${scoreColor(tooltip.score)}33`
        }}>
          <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>{tooltip.name}</div>
          <div style={{fontSize:11,color:"#64748B",marginTop:2}}>{tooltip.region}</div>
          <div style={{fontSize:14,fontWeight:800,color:scoreColor(tooltip.score),marginTop:4}}>
            {tooltip.score} — {scoreLabel(tooltip.score)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [internal, setInternal] = useState(() => {
    const d = {};
    COUNTRIES.forEach(c => { d[c.id] = { leadershipInterest:3, internalStakeholders:3, foreignStakeholders:3 }; });
    return d;
  });
  const [sel, setSel]           = useState(null);
  const [searchQ, setSearchQ]   = useState("");
  const [region, setRegion]     = useState("All");
  const [sortBy, setSortBy]     = useState("score");
  const [sortDir, setSortDir]   = useState("desc");
  const [tab, setTab]           = useState("map");

  const scored = useMemo(() => {
    return COUNTRIES
      .map(c => ({ ...c, score: calcScore(c, internal), coverage: coverageCount(c) }))
      .filter(c => c.name.toLowerCase().includes(searchQ.toLowerCase()) && (region==="All" || c.region===region))
      .sort((a, b) => {
        const d = sortDir==="desc"?-1:1;
        if (sortBy==="score")  return d*(a.score-b.score);
        if (sortBy==="name")   return d*a.name.localeCompare(b.name);
        if (sortBy==="region") return d*a.region.localeCompare(b.region);
        return d*((a[sortBy]??-1)-(b[sortBy]??-1));
      });
  }, [internal, searchQ, region, sortBy, sortDir]);

  const upd = useCallback((cid, key, val) => setInternal(p => ({ ...p, [cid]: { ...p[cid], [key]: val } })), []);
  const selC = sel ? COUNTRIES.find(c => c.id===sel) : null;
  const selScore = selC ? calcScore(selC, internal) : 0;
  const hs = col => { if(sortBy===col) setSortDir(d=>d==="desc"?"asc":"desc"); else { setSortBy(col); setSortDir("desc"); } };

  const TABS = [
    {id:"map",    label:"🗺  World Map"},
    {id:"table",  label:"📊  Country Table"},
    {id:"sources",label:"📚  Data Sources"},
    {id:"method", label:"⚙️  Methodology"},
  ];

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"linear-gradient(135deg,#0A0F1E,#0D1528,#0A1420)",minHeight:"100vh",color:"#E2E8F0",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <header style={{background:"rgba(8,12,26,0.98)",borderBottom:"1px solid rgba(56,139,253,0.18)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#1E5BA8,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 16px rgba(14,165,233,0.28)"}}>🌐</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#F1F5F9"}}>International Collaboration Dashboard</div>
            <div style={{fontSize:10,color:"#64748B",letterSpacing:1,textTransform:"uppercase"}}>Global Telecom Collaboration Intelligence</div>
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,transition:"all 0.2s",background:tab===t.id?"linear-gradient(135deg,#1E5BA8,#0EA5E9)":"rgba(255,255,255,0.05)",color:tab===t.id?"#fff":"#94A3B8",boxShadow:tab===t.id?"0 0 12px rgba(14,165,233,0.28)":"none"}}>{t.label}</button>
          ))}
        </div>
      </header>

      {/* Legend */}
      <div style={{display:"flex",gap:18,padding:"7px 24px",alignItems:"center",background:"rgba(8,12,26,0.6)",borderBottom:"1px solid rgba(255,255,255,0.05)",flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:"#64748B",textTransform:"uppercase",letterSpacing:1}}>Score:</span>
        {[["Strategic","#22C55E","≥80"],["High","#84CC16","65–79"],["Medium","#F59E0B","50–64"],["Low","#F97316","35–49"],["Minimal","#EF4444","<35"]].map(([l,c,r])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:c}}/>
            <span style={{fontSize:10,color:"#94A3B8"}}>{l} <span style={{color:"#475569"}}>({r})</span></span>
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:10,color:"#475569"}}>External 70% · Internal 30% · {COUNTRIES.length} countries</div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{flex:1,overflow:"auto",padding:20}}>

          {/* Filters */}
          {(tab==="map"||tab==="table") && (
            <div style={{display:"flex",gap:9,marginBottom:16,flexWrap:"wrap"}}>
              <input placeholder="🔍  Search country..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 12px",color:"#E2E8F0",fontSize:12,outline:"none",minWidth:190}}/>
              <div style={{display:"flex",gap:5}}>
                {REGIONS.map(r=>(
                  <button key={r} onClick={()=>setRegion(r)} style={{padding:"6px 11px",borderRadius:7,border:region===r?"1px solid rgba(14,165,233,0.4)":"1px solid rgba(255,255,255,0.06)",cursor:"pointer",fontSize:11,fontWeight:600,background:region===r?"rgba(14,165,233,0.18)":"rgba(255,255,255,0.05)",color:region===r?"#0EA5E9":"#64748B"}}>{r}</button>
                ))}
              </div>
              <div style={{marginLeft:"auto",color:"#64748B",fontSize:11,alignSelf:"center"}}>{scored.length} countries</div>
            </div>
          )}

          {/* MAP */}
          {tab==="map" && (
            <div>
              <WorldMap
                scored={scored}
                internal={internal}
                sel={sel}
                setSel={setSel}
                calcScore={calcScore}
                scoreColor={scoreColor}
                scoreLabel={scoreLabel}
              />
              <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:7}}>
                {scored.slice(0,12).map((c,i)=>(
                  <div key={c.id} onClick={()=>setSel(c.id===sel?null:c.id)} style={{background:sel===c.id?"rgba(14,165,233,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${sel===c.id?"rgba(14,165,233,0.4)":"rgba(255,255,255,0.07)"}`,borderRadius:9,padding:"8px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
                    <div style={{fontSize:11,fontWeight:800,color:scoreColor(c.score),minWidth:20}}>#{i+1}</div>
                    <div><div style={{fontSize:11,fontWeight:600,color:"#E2E8F0"}}>{c.name}</div><div style={{fontSize:10,color:scoreColor(c.score)}}>{c.score} — {scoreLabel(c.score)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLE */}
          {tab==="table" && (
            <div style={{background:"rgba(10,15,35,0.8)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"rgba(14,165,233,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <th style={thStyle}>#</th>
                    {[["name","Country"],["region","Region"],["score","Score"],["gdp","GDP"],["digitalMaturity","Dig. Maturity"],["aiReadiness","AI Ready"],["innovation","Innovation"],["coverage","Coverage"]].map(([k,l])=>(
                      <th key={k} onClick={()=>hs(k)} style={{...thStyle,cursor:"pointer",color:sortBy===k?"#0EA5E9":"#94A3B8"}}>{l}{sortBy===k?(sortDir==="desc"?" ↓":" ↑"):""}</th>
                    ))}
                    <th style={thStyle}>Level</th><th style={thStyle}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {scored.map((c,i)=>(
                    <tr key={c.id} onClick={()=>setSel(c.id===sel?null:c.id)} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:sel===c.id?"rgba(14,165,233,0.1)":i%2===0?"rgba(255,255,255,0.01)":"transparent",cursor:"pointer"}}>
                      <td style={tdStyle}><span style={{color:"#475569",fontWeight:700,fontSize:10}}>{i+1}</span></td>
                      <td style={{...tdStyle,fontWeight:600,color:"#F1F5F9"}}>{c.name}</td>
                      <td style={tdStyle}><span style={{fontSize:10,color:"#64748B",background:"rgba(255,255,255,0.06)",padding:"2px 7px",borderRadius:4}}>{c.region}</span></td>
                      <td style={tdStyle}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:50,height:4,background:"rgba(255,255,255,0.1)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${c.score}%`,height:"100%",background:scoreColor(c.score),borderRadius:2}}/></div>
                          <span style={{fontWeight:700,color:scoreColor(c.score),fontSize:12}}>{c.score}</span>
                        </div>
                      </td>
                      <td style={{...tdStyle,color:"#94A3B8"}}>{c.gdp??<span style={{color:"#475569"}}>N/A</span>}</td>
                      <td style={{...tdStyle,color:"#94A3B8"}}>{c.digitalMaturity??<span style={{color:"#475569"}}>N/A</span>}</td>
                      <td style={{...tdStyle,color:"#94A3B8"}}>{c.aiReadiness??<span style={{color:"#475569"}}>N/A</span>}</td>
                      <td style={{...tdStyle,color:"#94A3B8"}}>{c.innovation??<span style={{color:"#475569"}}>N/A</span>}</td>
                      <td style={tdStyle}><span style={{fontSize:10,color:c.coverage===10?"#22C55E":c.coverage>=6?"#F59E0B":"#EF4444"}}>{c.coverage}/10</span></td>
                      <td style={tdStyle}><span style={{background:`${scoreColor(c.score)}22`,color:scoreColor(c.score),padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,border:`1px solid ${scoreColor(c.score)}44`}}>{scoreLabel(c.score)}</span></td>
                      <td style={tdStyle}><button onClick={e=>{e.stopPropagation();setSel(c.id===sel?null:c.id);}} style={{background:"rgba(14,165,233,0.15)",border:"1px solid rgba(14,165,233,0.3)",color:"#0EA5E9",borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:10}}>{sel===c.id?"Close":"Open"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DATA SOURCES */}
          {tab==="sources" && (
            <div>
              <h2 style={{fontSize:17,fontWeight:700,color:"#F1F5F9",marginBottom:6}}>External Data Sources & Indexes</h2>
              <p style={{fontSize:13,color:"#64748B",lineHeight:1.7,marginBottom:22}}>
                The external component (70% of total score) draws from 10 globally recognised indexes published in 2024. All raw values are normalised to a 0–100 scale for comparability. Where a country is not covered by a given index, the value is shown as <strong style={{color:"#F59E0B"}}>N/A</strong> and that indicator is excluded from the country's external average.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>
                {INDICATORS.map(ind=>(
                  <div key={ind.key} style={{background:"rgba(10,15,35,0.8)",border:`1px solid ${ind.color}33`,borderRadius:13,padding:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                      <div style={{width:9,height:9,borderRadius:3,background:ind.color,flexShrink:0}}/>
                      <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>{ind.label}</div>
                    </div>
                    <div style={{fontSize:10,color:"#0EA5E9",fontWeight:600,marginBottom:7,background:"rgba(14,165,233,0.1)",display:"inline-block",padding:"2px 7px",borderRadius:4}}>{ind.source}</div>
                    <p style={{fontSize:12,color:"#94A3B8",lineHeight:1.65,margin:0}}>{ind.description}</p>
                    <div style={{marginTop:8,fontSize:10,color:"#475569"}}>Weight: <span style={{color:ind.color,fontWeight:700}}>7%</span> of total score</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:24,background:"rgba(10,15,35,0.8)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:18}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:14}}>Data Coverage by Region</h3>
                {REGIONS.filter(r=>r!=="All").map(r=>{
                  const cs=COUNTRIES.filter(c=>c.region===r);
                  const full=cs.filter(c=>coverageCount(c)===10).length;
                  const part=cs.filter(c=>coverageCount(c)>0&&coverageCount(c)<10).length;
                  const none=cs.filter(c=>coverageCount(c)===0).length;
                  return (
                    <div key={r} style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
                      <div style={{width:120,fontSize:11,color:"#94A3B8"}}>{r}</div>
                      <div style={{flex:1,height:12,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",display:"flex"}}>
                        <div style={{width:`${(full/cs.length)*100}%`,background:"#22C55E",height:"100%"}}/>
                        <div style={{width:`${(part/cs.length)*100}%`,background:"#F59E0B",height:"100%"}}/>
                        <div style={{width:`${(none/cs.length)*100}%`,background:"#475569",height:"100%"}}/>
                      </div>
                      <div style={{fontSize:10,color:"#64748B",minWidth:150}}>
                        <span style={{color:"#22C55E"}}>{full} full</span> · <span style={{color:"#F59E0B"}}>{part} partial</span> · <span style={{color:"#475569"}}>{none} N/A</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* METHODOLOGY */}
          {tab==="method" && (
            <div style={{maxWidth:840}}>
              <h2 style={{fontSize:17,fontWeight:700,color:"#F1F5F9",marginBottom:6}}>Scoring Methodology</h2>
              <p style={{fontSize:13,color:"#64748B",lineHeight:1.75,marginBottom:24}}>
                The Collaboration Score is a composite indicator that quantifies the degree of international collaboration potential with foreign Telecommunication Ministries. It blends objectively measured external indicators with internally assessed qualitative criteria.
              </p>

              <div style={{background:"rgba(14,165,233,0.06)",border:"1px solid rgba(14,165,233,0.2)",borderRadius:13,padding:18,marginBottom:22}}>
                <div style={{fontSize:10,color:"#0EA5E9",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Core Formula</div>
                <div style={{fontFamily:"monospace",fontSize:13,color:"#E2E8F0",lineHeight:2.2}}>
                  <div><span style={{color:"#F59E0B"}}>Collaboration Score</span> = <span style={{color:"#22C55E"}}>External Score (70%)</span> + <span style={{color:"#A855F7"}}>Internal Score (30%)</span></div>
                  <div style={{marginLeft:18,fontSize:11,color:"#64748B"}}>
                    <div>External Score = Average of all available indicator scores × 0.70</div>
                    <div>Internal Score = Average of 3 criteria scores (1–5 → normalised ×20) × 0.30</div>
                  </div>
                </div>
              </div>

              <div style={{marginBottom:22}}>
                <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#22C55E22",border:"1px solid #22C55E44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#22C55E",fontWeight:800}}>E</div>
                  External Indicators — 70% of Total Score
                </div>
                <p style={{fontSize:12,color:"#94A3B8",lineHeight:1.75,marginBottom:10}}>Ten globally published indexes, each contributing an equal <strong style={{color:"#F1F5F9"}}>7%</strong>. If a country is missing from an index, that index is excluded and the remaining available indicators are re-averaged within the 70% envelope — the country is not penalised for data gaps outside its control.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {INDICATORS.map((ind,i)=>(
                    <div key={ind.key} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"7px 11px"}}>
                      <div style={{width:20,height:20,borderRadius:5,background:`${ind.color}22`,border:`1px solid ${ind.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ind.color,fontWeight:800}}>{i+1}</div>
                      <div><div style={{fontSize:11,color:"#E2E8F0",fontWeight:600}}>{ind.label}</div><div style={{fontSize:9,color:"#475569"}}>{ind.source} · 7%</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:22}}>
                <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#A855F722",border:"1px solid #A855F744",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#A855F7",fontWeight:800}}>I</div>
                  Internal Criteria — 30% of Total Score
                </div>
                <p style={{fontSize:12,color:"#94A3B8",lineHeight:1.75,marginBottom:10}}>Three qualitative criteria assessed by ministry analysts, each rated <strong style={{color:"#F1F5F9"}}>1–5</strong> (contributing <strong style={{color:"#F1F5F9"}}>10% each</strong>). Ratings are normalised ×20 to a 0–100 scale before weighting.</p>
                <div style={{display:"flex",gap:7,marginBottom:14}}>
                  {[1,2,3,4,5].map(n=>(
                    <div key={n} style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"9px 6px",textAlign:"center"}}>
                      <div style={{fontSize:16,fontWeight:800,color:"#0EA5E9",marginBottom:2}}>{n}</div>
                      <div style={{fontSize:10,color:"#64748B"}}>{SCORE_LABELS[n]}</div>
                      <div style={{fontSize:9,color:"#475569",marginTop:2}}>= {n*20}/100</div>
                    </div>
                  ))}
                </div>
                {INTERNAL_CRITERIA.map(ic=>(
                  <div key={ic.key} style={{display:"flex",alignItems:"flex-start",gap:9,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"9px 13px",marginBottom:7}}>
                    <div style={{width:9,height:9,borderRadius:3,background:ic.color,marginTop:3,flexShrink:0}}/>
                    <div><div style={{fontSize:12,color:"#E2E8F0",fontWeight:600}}>{ic.label}</div><div style={{fontSize:10,color:"#475569"}}>Weight: 10% of total score</div></div>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(10,15,35,0.8)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:18,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:12}}>Score Tiers & Interpretation</div>
                {[
                  ["Strategic","#22C55E","80–100","Highest-priority partner. Strong alignment across external indicators and internal assessment. Recommended for active MOU negotiations and joint programme development."],
                  ["High","#84CC16","65–79","Strong collaboration candidate. Solid digital maturity and alignment. Suitable for bilateral working groups and structured engagement programmes."],
                  ["Medium","#F59E0B","50–64","Moderate collaboration potential. Gaps exist in select indicators. Engagement should focus on targeted capacity-building and sector-specific dialogue."],
                  ["Low","#F97316","35–49","Limited near-term collaboration potential. Foundational digital infrastructure gaps. Consider multilateral formats or development-oriented frameworks."],
                  ["Minimal","#EF4444","0–34","Very limited data availability or very early-stage digital ecosystem. Monitor for future development; engagement via international bodies recommended."],
                ].map(([label,color,range,desc])=>(
                  <div key={label} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{minWidth:85,background:`${color}18`,border:`1px solid ${color}44`,borderRadius:8,padding:"5px 9px",textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:800,color}}>{label}</div>
                      <div style={{fontSize:9,color:"#475569"}}>{range}</div>
                    </div>
                    <div style={{fontSize:12,color:"#94A3B8",lineHeight:1.65}}>{desc}</div>
                  </div>
                ))}
              </div>

              <div style={{fontSize:11,color:"#475569",lineHeight:1.75}}>
                <strong style={{color:"#64748B"}}>Note on N/A data:</strong> Countries not covered by a given index are not penalised. The missing indicator is excluded and the remaining available indicators are re-averaged within the 70% external envelope, ensuring data-scarce nations are assessed fairly on the evidence available.
              </div>
            </div>
          )}
        </div>

        {/* SIDE PANEL */}
        {selC && (
          <div style={{width:340,background:"rgba(7,10,24,0.99)",borderLeft:"1px solid rgba(255,255,255,0.08)",overflow:"auto",flexShrink:0}}>
            <div style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:"#F1F5F9"}}>{selC.name}</div>
                  <div style={{fontSize:10,color:"#64748B",marginTop:2}}>{selC.region}</div>
                </div>
                <button onClick={()=>setSel(null)} style={{background:"rgba(255,255,255,0.07)",border:"none",color:"#94A3B8",width:25,height:25,borderRadius:6,cursor:"pointer",fontSize:12}}>✕</button>
              </div>

              <div style={{background:`linear-gradient(135deg,${scoreColor(selScore)}18,${scoreColor(selScore)}08)`,border:`1px solid ${scoreColor(selScore)}33`,borderRadius:11,padding:13,marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:9,color:"#64748B",textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Collaboration Score</div>
                <div style={{fontSize:42,fontWeight:900,color:scoreColor(selScore),lineHeight:1}}>{selScore}</div>
                <div style={{fontSize:12,fontWeight:700,color:scoreColor(selScore),marginTop:2}}>{scoreLabel(selScore)}</div>
                <div style={{width:"100%",height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,marginTop:9,overflow:"hidden"}}>
                  <div style={{width:`${selScore}%`,height:"100%",background:`linear-gradient(90deg,${scoreColor(selScore)},${scoreColor(selScore)}88)`,borderRadius:2}}/>
                </div>
                <div style={{fontSize:9,color:"#475569",marginTop:5}}>Index coverage: {coverageCount(selC)}/10 indicators</div>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{fontSize:9,color:"#64748B",textTransform:"uppercase",letterSpacing:1,marginBottom:9}}>External Indicators (70%)</div>
                {INDICATORS.map(ind=>(
                  <div key={ind.key} style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:10,color:"#CBD5E1"}}>{ind.label}</span>
                      <span style={{fontSize:10,fontWeight:700,color:selC[ind.key]===null?"#475569":ind.color}}>{selC[ind.key]===null?"N/A":selC[ind.key]}</span>
                    </div>
                    <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                      {selC[ind.key]!==null&&<div style={{width:`${selC[ind.key]}%`,height:"100%",background:ind.color,borderRadius:2}}/>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(14,165,233,0.05)",border:"1px solid rgba(14,165,233,0.15)",borderRadius:10,padding:13,marginBottom:16}}>
                <div style={{fontSize:9,color:"#0EA5E9",textTransform:"uppercase",letterSpacing:1,marginBottom:11}}>🔒 Internal Assessment (30%)</div>
                {INTERNAL_CRITERIA.map(ic=>{
                  const val=internal[selC.id]?.[ic.key]??3;
                  return (
                    <div key={ic.key} style={{marginBottom:13}}>
                      <div style={{fontSize:10,color:"#CBD5E1",marginBottom:6,lineHeight:1.4}}>{ic.label}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        {[1,2,3,4,5].map(n=>(
                          <button key={n} onClick={()=>upd(selC.id,ic.key,n)} style={{width:30,height:30,borderRadius:7,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,transition:"all 0.15s",background:val>=n?ic.color:"rgba(255,255,255,0.07)",color:val>=n?"#fff":"#475569",boxShadow:val===n?`0 0 8px ${ic.color}55`:"none",transform:val===n?"scale(1.1)":"scale(1)"}}>{n}</button>
                        ))}
                        <span style={{fontSize:10,color:ic.color,fontWeight:700,marginLeft:4}}>{SCORE_LABELS[val]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{fontSize:10,color:"#475569",lineHeight:1.9}}>
                <div style={{color:"#64748B",fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:1,fontSize:9}}>Score Breakdown</div>
                {(()=>{
                  const cov=coverageCount(selC);
                  const extAvg=cov>0?INDICATORS.filter(ind=>selC[ind.key]!==null).reduce((s,ind)=>s+selC[ind.key],0)/cov:0;
                  const extScore=Math.round(extAvg*0.70);
                  const intScore=Math.round(INTERNAL_CRITERIA.reduce((s,ic)=>s+((internal[selC.id]?.[ic.key]??3)*20)*INT_WEIGHT,0));
                  return (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>External ({cov}/10 indicators × 70%)</span><span style={{color:"#94A3B8"}}>{extScore}/70</span></div>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>Internal (3 criteria × 10% each)</span><span style={{color:"#94A3B8"}}>{intScore}/30</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.08)",color:"#E2E8F0",fontWeight:700}}><span>Total</span><span style={{color:scoreColor(selScore)}}>{selScore}/100</span></div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
