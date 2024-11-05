const timezoneMapping = {
  // **North America**
  "America/New_York": "Eastern Time",
  "America/Detroit": "Eastern Time",
  "America/Toronto": "Eastern Time",
  "America/Chicago": "Central Time",
  "America/Winnipeg": "Central Time",
  "America/Denver": "Mountain Time",
  "America/Phoenix": "Mountain Time (No DST)",
  "America/Los_Angeles": "Pacific Time",
  "America/Vancouver": "Pacific Time",
  "America/Anchorage": "Alaska Time",
  "Pacific/Honolulu": "Hawaii-Aleutian Time",

  // **South America**
  "America/Sao_Paulo": "Brasilia Time",
  "America/Argentina/Buenos_Aires": "Argentina Time",
  "America/Bogota": "Colombia Time",
  "America/Caracas": "Venezuela Time",
  "America/Lima": "Peru Time",
  "America/Santiago": "Chile Time",

  // **Europe**
  "Europe/London": "Greenwich Mean Time",
  "Europe/Dublin": "Greenwich Mean Time",
  "Europe/Lisbon": "Western European Time",
  "Europe/Madrid": "Central European Time",
  "Europe/Paris": "Central European Time",
  "Europe/Berlin": "Central European Time",
  "Europe/Brussels": "Central European Time",
  "Europe/Rome": "Central European Time",
  "Europe/Amsterdam": "Central European Time",
  "Europe/Prague": "Central European Time",
  "Europe/Vienna": "Central European Time",
  "Europe/Budapest": "Central European Time",
  "Europe/Warsaw": "Central European Time",
  "Europe/Helsinki": "Eastern European Time",
  "Europe/Athens": "Eastern European Time",
  "Europe/Bucharest": "Eastern European Time",
  "Europe/Istanbul": "Turkey Time",
  "Europe/Moscow": "Moscow Time",

  // **Africa**
  "Africa/Cairo": "Eastern European Time",
  "Africa/Johannesburg": "South Africa Standard Time",
  "Africa/Lagos": "West Africa Time",
  "Africa/Nairobi": "East Africa Time",
  "Africa/Algiers": "Central European Time",

  // **Asia**
  "Asia/Baghdad": "Arabian Time",
  "Asia/Riyadh": "Arabian Time",
  "Asia/Tehran": "Iran Standard Time",
  "Asia/Dubai": "Gulf Standard Time",
  "Asia/Kabul": "Afghanistan Time",
  "Asia/Karachi": "Pakistan Time",
  "Asia/Kolkata": "India Standard Time",
  "Asia/Dhaka": "Bangladesh Time",
  "Asia/Jakarta": "Western Indonesia Time",
  "Asia/Bangkok": "Indochina Time",
  "Asia/Singapore": "Singapore Time",
  "Asia/Manila": "Philippine Time",
  "Asia/Shanghai": "China Standard Time",
  "Asia/Hong_Kong": "Hong Kong Time",
  "Asia/Tokyo": "Japan Standard Time",
  "Asia/Seoul": "Korea Standard Time",
  "Asia/Taipei": "Taipei Time",
  "Asia/Kuala_Lumpur": "Malaysia Time",

  // **Australia and Oceania**
  "Australia/Sydney": "Australian Eastern Time",
  "Australia/Brisbane": "Australian Eastern Time (No DST)",
  "Australia/Adelaide": "Australian Central Time",
  "Australia/Darwin": "Australian Central Time (No DST)",
  "Australia/Perth": "Australian Western Time",
  "Pacific/Auckland": "New Zealand Time",
  "Pacific/Fiji": "Fiji Time",
  "Pacific/Guam": "Chamorro Time",
  "Pacific/Tongatapu": "Tonga Time",
  "Pacific/Apia": "Samoa Time",

  // **Middle East**
  "Asia/Jerusalem": "Israel Standard Time",
  "Asia/Damascus": "Eastern European Time",
  "Asia/Beirut": "Eastern European Time",
  "Asia/Amman": "Eastern European Time",
  "Asia/Kuwait": "Arabian Time",
  
  // **Other Regions**
  "Atlantic/Reykjavik": "Greenwich Mean Time (No DST)",
  "Atlantic/Azores": "Azores Time",
  "Atlantic/Bermuda": "Atlantic Time",
  "Atlantic/Stanley": "Falkland Islands Time",
  "Atlantic/South_Georgia": "South Georgia Time",

  // **Fallback for any unlisted zones**
  "default": "Unknown Timezone"
};

export default timezoneMapping