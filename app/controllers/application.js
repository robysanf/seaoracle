import Ember from 'ember';

export default Ember.Controller.extend({
    isLogin: false,

    LOG_TRANSITIONS: true,
    visibility: [
        'private',
        'public'
    ],

    /*     ***local storage***     */
    grantsValue: JSON.parse(localStorage["grantsValue"] ? localStorage["grantsValue"] : "[\" \"]"),
    user_record: JSON.parse(localStorage["user_record"] ? localStorage["user_record"] : "[\" \"]"),

    company: localStorage['company'],
    token: localStorage['token'],
    companyType: localStorage['companyType'],
    userId: localStorage['userId'],
    username: localStorage['username'],  //univoco per un utente
    userProfile: localStorage['userProfile'],
    companyProfile: localStorage['companyProfile'],
    selectedDepot: localStorage['selectedDepot'],
    isAdmin: localStorage['isAdmin'],
//    user_record: localStorage['userRecord'],

    companyChanged: function() { localStorage.company = this.company; }.observes('company'),
    tokenChanged: function() {
        localStorage.token = this.token;
        this.globals.set('token', this.token);
    }.observes('token'),

//    user_recordChanged: function() { localStorage.userRecord = this.userRecord; }.observes('userRecord'),
    companyTypeChanged: function() { localStorage.companyType = this.companyType; }.observes('companyType'),
    userIdChanged: function() { localStorage.userId = this.userId; }.observes('userId'),
    usernameChanged: function() { localStorage.username = this.username; }.observes('username'),
    userProfileChanged: function() { localStorage.userProfile = this.userProfile; }.observes('userProfile'),
    companyProfileChanged: function() { localStorage.companyProfile = this.companyProfile; }.observes('companyProfile'),

    selectedDepotChanged: function() { localStorage.selectedDepot = this.selectedDepot; }.observes('selectedDepot'),
    isAdminChanged: function() { localStorage.isAdmin = this.isAdmin; }.observes('isAdmin'),


    currencyClassification: [
        '',
        'EUR',
        'USD'
    ],

    /*     ***auto complete***     */
    autocompleteUser: Ember.A(),
    autocompleteCompany: Ember.A(),
    autocompleteCharge: Ember.A(),
    autocompletePoi: Ember.A(),
    autocompletePoiPort: Ember.A(),
    autocompletePoiDepot: Ember.A(),
    autocompletePoiWarehouse: Ember.A(),
    autocompleteEquipment: Ember.A(),
    autocompleteEquipmentCode: Ember.A(),
    autocompleteEqClassification: Ember.A(),
    autocompleteEqClassificationContainer: Ember.A(),
    autocompleteVoyage: Ember.A(),
    autocompleteBooking: Ember.A(),
    autocompleteRoRo: Ember.A(),

    autocompleteStamp: Ember.A(),
    autocompleteSegment: Ember.A(),
    autocompleteVessel: Ember.A(),
    autocompleteTemplate: Ember.A(),
    autocompleteDocument: Ember.A(),
    autocompleteChassisNum: Ember.A(),
    autocompletePaymentPlan: Ember.A(),
    /*     ***infinite scroll***     */
    firstIndex: 0,
    perPage: 25,
    queryExpressResults: null,
    queryExpressResults_length: null,
    isAll: false,
    items: Ember.A(),

    searchResultList: Ember.A(),
    searchResults: function() { return this.searchResultList; }.property('searchResultList'),

    nations_name: [
        'Afganistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria',
        'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bonaire','Bosnia-Herzegovina','Botswana',
        'Brazil','British Indian Ocean Territory','British Virgin Islands','Brunei Darussalam','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada',
        'Cape Verde Islands','Cayman Islands','Central African Republic','Chile','China','Christmas Island','Cocos (Keeling) Islands','Colombia','Comoros','Congo (Brazzaville)',
        'Congo (Kinshasa)','Cook Islands','Costa Rica','Croatia','Cuba','Curaçao','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador',
        'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Faeroe Islands','Falkland Islands','Fiji','Finland','France','French Guiana','French Polynesia',
        'French Southern Territories','Gabon','Gambia','Georgia','Germany','Ghana','Gibralter','Greece','Greenland','Grenada','Guadeloupe','Guam','Guatemala','Guernsey','Guinea',
        'Guinea-Bissau','Guyana','Haiti','Holy See','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast',
        'Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
        'Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Martinique','Mauritania','Mauritius','Mayotte','Mexico',
        'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands Antilles','Netherlands','New Caledonia',
        'New Zealand','Nicaragua','Niger','Nigeria','Niue','Norfolk Island','North Korea','Northern Mariana Islands','Norway','Oman','Pakistan','Palau','Palestinian Territories','Panama',
        'Papua New Guinea','Paraguay','Peru','Philippines','Pitcairn Islands','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','Réunion','Saba','Saint Barthélemy',
        'Saint Christopher & Nevis','Saint Helena','Saint Lucia','Saint Martin','Saint Pierre & Miquelon','Saint Vincent & The Grenadines','Samoa','San Marino','Sao Tome & Principe',
        'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Sint Eustatius','Sint Maarten','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
        'South Georgia & The South Sandwish Islands','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Thailand','Togo',
        'Tokelau','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Turks & Caicos Islands','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
        'United States Virgin Islands','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Wallis & Futuna','Western Sahara','Yemen','Zambia','Zimbabwe'
    ],
    nations: [
        {
            "euname": "AFGHANISTAN",
            "iso3": "AFG",
            "iso2": "AF",
            "grc": "AFG",
            "isonum": "4",
            "country": "Afganistan"
        },
        {
            "linked_country": "Finland",
            "iso3": "ALA",
            "iso2": "AX",
            "grc": "ALA",
            "isonum": "248",
            "country": "Aland Islands",
            "imperitive": "Postal"
        },
        {
            "euname": "Albania",
            "iso3": "ALB",
            "iso2": "AL",
            "grc": "ALB",
            "isonum": "8",
            "country": "Albania"
        },
        {
            "euname": "ALGERIA",
            "iso3": "DZA",
            "iso2": "DZ",
            "grc": "ALG",
            "isonum": "12",
            "country": "Algeria"
        },
        {
            "linked_country": "United States of America",
            "iso3": "ASM",
            "iso2": "AS",
            "grc": "AMS",
            "isonum": "16",
            "country": "American Samoa",
            "imperitive": "Geographical"
        },
        {
            "euname": "ANDORRA",
            "iso3": "AND",
            "iso2": "AD",
            "grc": "AND",
            "isonum": "20",
            "country": "Andorra"
        },
        {
            "euname": "ANGOLA",
            "iso3": "AGO",
            "iso2": "AO",
            "grc": "ANG",
            "isonum": "24",
            "country": "Angola"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "AIA",
            "iso2": "AI",
            "grc": "ANU",
            "isonum": "660",
            "country": "Anguilla",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "ANTIGUA AND BARBUDA",
            "iso3": "ATG",
            "iso2": "AG",
            "grc": "ANT",
            "isonum": "28",
            "country": "Antigua & Barbuda"
        },
        {
            "euname": "Argentina",
            "iso3": "ARG",
            "iso2": "AR",
            "grc": "ARG",
            "isonum": "32",
            "country": "Argentina"
        },
        {
            "euname": "Armenia",
            "iso3": "ARM",
            "iso2": "AM",
            "grc": "ARM",
            "isonum": "51",
            "country": "Armenia"
        },
        {
            "euname": "ARUBA",
            "linked_country": "Netherlands",
            "iso3": "ABW",
            "iso2": "AW",
            "grc": "ARU",
            "isonum": "533",
            "country": "Aruba",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Australia",
            "iso3": "AUS",
            "iso2": "AU",
            "grc": "AST",
            "isonum": "36",
            "country": "Australia"
        },
        {
            "euname": "Austria",
            "iso3": "AUT",
            "iso2": "AT",
            "grc": "AUS",
            "isonum": "40",
            "country": "Austria"
        },
        {
            "euname": "AZERBAIJAN",
            "iso3": "AZE",
            "iso2": "AZ",
            "grc": "AZE",
            "isonum": "31",
            "country": "Azerbaijan"
        },
        {
            "euname": "BAHAMAS",
            "iso3": "BHS",
            "iso2": "BS",
            "grc": "BAH",
            "isonum": "44",
            "country": "Bahamas"
        },
        {
            "euname": "BAHRAIN",
            "iso3": "BHR",
            "iso2": "BH",
            "grc": "BAR",
            "isonum": "48",
            "country": "Bahrain"
        },
        {
            "euname": "BANGLADESH",
            "iso3": "BGD",
            "iso2": "BD",
            "grc": "BAN",
            "isonum": "50",
            "country": "Bangladesh"
        },
        {
            "euname": "Barbados",
            "iso3": "BRB",
            "iso2": "BB",
            "grc": "BAB",
            "isonum": "52",
            "country": "Barbados"
        },
        {
            "euname": "BELARUS",
            "iso3": "BLR",
            "iso2": "BY",
            "grc": "BEO",
            "isonum": "112",
            "country": "Belarus"
        },
        {
            "euname": "Belgium",
            "iso3": "BEL",
            "iso2": "BE",
            "grc": "BEL",
            "isonum": "56",
            "country": "Belgium"
        },
        {
            "euname": "BELIZE",
            "iso3": "BLZ",
            "iso2": "BZ",
            "grc": "BEI",
            "isonum": "84",
            "country": "Belize"
        },
        {
            "euname": "Benin",
            "iso3": "BEN",
            "iso2": "BJ",
            "grc": "BEN",
            "isonum": "204",
            "country": "Benin"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "BMU",
            "iso2": "BM",
            "grc": "BER",
            "isonum": "60",
            "country": "Bermuda",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "BHUTAN",
            "iso3": "BTN",
            "iso2": "BT",
            "grc": "BHU",
            "isonum": "64",
            "country": "Bhutan"
        },
        {
            "euname": "BOLIVIA",
            "iso3": "BOL",
            "iso2": "BO",
            "grc": "BOL",
            "isonum": "68",
            "country": "Bolivia"
        },
        {
            "linked_country": "Netherlands",
            "iso3": "BES",
            "iso2": "BQ",
            "grc": "BON",
            "isonum": "535",
            "country": "Bonaire",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Bosnia-Herzegovina",
            "iso3": "BIH",
            "iso2": "BA",
            "grc": "BOS",
            "isonum": "70",
            "country": "Bosnia-Herzegovina"
        },
        {
            "euname": "BOTSWANA",
            "iso3": "BWA",
            "iso2": "BW",
            "grc": "BOT",
            "isonum": "72",
            "country": "Botswana"
        },
        {
            "euname": "Brazil",
            "iso3": "BRA",
            "iso2": "BR",
            "grc": "BRA",
            "isonum": "76",
            "country": "Brazil"
        },
        {
            "linked_country": "United Kingdom, United States of America",
            "iso3": "IOT",
            "iso2": "IO",
            "grc": "BIO",
            "isonum": "86",
            "country": "British Indian Ocean Territory",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "British Virgin Islands",
            "linked_country": "United Kingdom",
            "iso3": "VGB",
            "iso2": "VG",
            "grc": "BVI",
            "isonum": "92",
            "country": "British Virgin Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "BRUNEI",
            "iso3": "BRN",
            "iso2": "BN",
            "grc": "BRU",
            "isonum": "96",
            "country": "Brunei Darussalam"
        },
        {
            "euname": "Bulgaria",
            "iso3": "BGR",
            "iso2": "BG",
            "grc": "BUL",
            "isonum": "100",
            "country": "Bulgaria"
        },
        {
            "euname": "BURKINA FASO",
            "iso3": "BFA",
            "iso2": "BF",
            "grc": "BUK",
            "isonum": "854",
            "country": "Burkina Faso"
        },
        {
            "euname": "BURUNDI",
            "iso3": "BDI",
            "iso2": "BI",
            "grc": "BUU",
            "isonum": "108",
            "country": "Burundi"
        },
        {
            "euname": "Cambodia",
            "iso3": "KHM",
            "iso2": "KH",
            "grc": "CAM",
            "isonum": "116",
            "country": "Cambodia"
        },
        {
            "euname": "Cameroon",
            "iso3": "CMR",
            "iso2": "CM",
            "grc": "CAE",
            "isonum": "120",
            "country": "Cameroon"
        },
        {
            "euname": "Canada",
            "iso3": "CAN",
            "iso2": "CA",
            "grc": "CAN",
            "isonum": "124",
            "country": "Canada"
        },
        {
            "euname": "CAPE VERDE",
            "iso3": "CPV",
            "iso2": "CV",
            "grc": "CAP",
            "isonum": "132",
            "country": "Cape Verde Islands"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "CYM",
            "iso2": "KY",
            "grc": "CAY",
            "isonum": "136",
            "country": "Cayman Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "CENTRAL AFRICAN, REPUBLIC",
            "iso3": "CAF",
            "iso2": "CF",
            "grc": "CEN",
            "isonum": "140",
            "country": "Central African Republic"
        },
        {
            "euname": "Chad",
            "iso3": "TCD",
            "iso2": "TD",
            "grc": "CHA",
            "isonum": "148",
            "country": "Chad"
        },
        {
            "euname": "CHILE",
            "iso3": "CHL",
            "iso2": "CL",
            "grc": "CHI",
            "isonum": "152",
            "country": "Chile"
        },
        {
            "euname": "CHINA",
            "iso3": "CHN",
            "iso2": "CN",
            "grc": "CHN",
            "isonum": "156",
            "country": "China"
        },
        {
            "linked_country": "Australia",
            "iso3": "CXR",
            "iso2": "CX",
            "grc": "CHR",
            "isonum": "162",
            "country": "Christmas Island",
            "imperitive": "Geographical"
        },
        {
            "linked_country": "Australia",
            "iso3": "CCK",
            "iso2": "CC",
            "grc": "COC",
            "isonum": "166",
            "country": "Cocos (Keeling) Islands",
            "imperitive": "Geographical"
        },
        {
            "euname": "Colombia",
            "iso3": "COL",
            "iso2": "CO",
            "grc": "CLO",
            "isonum": "170",
            "country": "Colombia"
        },
        {
            "euname": "COMOROS",
            "iso3": "COM",
            "iso2": "KM",
            "grc": "COM",
            "isonum": "174",
            "country": "Comoros"
        },
        {
            "euname": "CONGO",
            "iso3": "COG",
            "iso2": "CG",
            "grc": "CNG",
            "isonum": "178",
            "country": "Congo (Brazzaville)"
        },
        {
            "euname": "CONGO, DEMOCRATIC REPUBLIC OF",
            "iso3": "ZAR",
            "iso2": "CD",
            "grc": "ZAI",
            "isonum": "180",
            "country": "Congo (Kinshasa)"
        },
        {
            "euname": "COOK ISLANDS",
            "linked_country": "New Zealand",
            "iso3": "COK",
            "iso2": "CK",
            "grc": "COO",
            "isonum": "184",
            "country": "Cook Islands",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "Costa Rica",
            "iso3": "CRI",
            "iso2": "CR",
            "grc": "COS",
            "isonum": "188",
            "country": "Costa Rica"
        },
        {
            "euname": "Croatia",
            "iso3": "HRV",
            "iso2": "HR",
            "grc": "CRO",
            "isonum": "191",
            "country": "Croatia"
        },
        {
            "euname": "CUBA",
            "iso3": "CUB",
            "iso2": "CU",
            "grc": "CUB",
            "isonum": "192",
            "country": "Cuba"
        },
        {
            "linked_country": "Netherlands",
            "iso3": "CUW",
            "iso2": "CW",
            "grc": "CUR",
            "isonum": "531",
            "country": "Curaçao",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Cyprus",
            "iso3": "CYP",
            "iso2": "CY",
            "grc": "CYP",
            "isonum": "196",
            "country": "Cyprus"
        },
        {
            "euname": "Czech Republic",
            "iso3": "CZE",
            "iso2": "CZ",
            "grc": "CZE",
            "isonum": "203",
            "country": "Czech Republic"
        },
        {
            "euname": "Denmark",
            "iso3": "DNK",
            "iso2": "DK",
            "grc": "DEN",
            "isonum": "208",
            "country": "Denmark"
        },
        {
            "euname": "DJIBOUTI",
            "iso3": "DJI",
            "iso2": "DJ",
            "grc": "DJI",
            "isonum": "262",
            "country": "Djibouti"
        },
        {
            "euname": "DOMINIQUE",
            "iso3": "DMA",
            "iso2": "DM",
            "grc": "DOI",
            "isonum": "212",
            "country": "Dominica"
        },
        {
            "euname": "Dominican Republic",
            "iso3": "DOM",
            "iso2": "DO",
            "grc": "DOM",
            "isonum": "214",
            "country": "Dominican Republic"
        },
        {
            "euname": "EAST TIMOR",
            "iso3": "TLS",
            "iso2": "TL",
            "grc": "ETI",
            "isonum": "626",
            "country": "East Timor"
        },
        {
            "euname": "Ecuador",
            "iso3": "ECU",
            "iso2": "EC",
            "grc": "ECU",
            "isonum": "218",
            "country": "Ecuador"
        },
        {
            "euname": "EGYPT",
            "iso3": "EGY",
            "iso2": "EG",
            "grc": "EGY",
            "isonum": "818",
            "country": "Egypt"
        },
        {
            "euname": "El Salvador",
            "iso3": "SLV",
            "iso2": "SV",
            "grc": "ELS",
            "isonum": "222",
            "country": "El Salvador"
        },
        {
            "euname": "EQUATORIAL GUINEA",
            "iso3": "GNQ",
            "iso2": "GQ",
            "grc": "EQA",
            "isonum": "226",
            "country": "Equatorial Guinea"
        },
        {
            "euname": "ERITREA",
            "iso3": "ERI",
            "iso2": "ER",
            "grc": "ERI",
            "isonum": "232",
            "country": "Eritrea"
        },
        {
            "euname": "Estonia",
            "iso3": "EST",
            "iso2": "EE",
            "grc": "EST",
            "isonum": "233",
            "country": "Estonia"
        },
        {
            "euname": "ETHIOPIA",
            "iso3": "ETH",
            "iso2": "ET",
            "grc": "ETH",
            "isonum": "231",
            "country": "Ethiopia"
        },
        {
            "euname": "FAROE ISLANDS",
            "iso3": "FRO",
            "iso2": "FO",
            "grc": "FAE",
            "isonum": "234",
            "country": "Faeroe Islands"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "FLK",
            "iso2": "FK",
            "grc": "FAL",
            "isonum": "238",
            "country": "Falkland Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "FIJI",
            "iso3": "FJI",
            "iso2": "FJ",
            "grc": "FIJ",
            "isonum": "242",
            "country": "Fiji"
        },
        {
            "euname": "Finland",
            "iso3": "FIN",
            "iso2": "FI",
            "grc": "FIN",
            "isonum": "246",
            "country": "Finland"
        },
        {
            "euname": "France",
            "iso3": "FRA",
            "iso2": "FR",
            "grc": "FRA",
            "isonum": "250",
            "country": "France"
        },
        {
            "euname": "FRENCH GUYANA",
            "linked_country": "France",
            "iso3": "GUF",
            "iso2": "GF",
            "grc": "FGU",
            "isonum": "254",
            "country": "French Guiana",
            "imperitive": "Geographical; Telephone"
        },
        {
            "euname": "FRENCH POLYNESIA",
            "linked_country": "France",
            "iso3": "PYF",
            "iso2": "PF",
            "grc": "FPO",
            "isonum": "258",
            "country": "French Polynesia",
            "imperitive": "Geographical; Currency; Telephone"
        },
        {
            "linked_country": "France",
            "iso3": "ATF",
            "iso2": "TF",
            "grc": "FST",
            "isonum": "260",
            "country": "French Southern Territories",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "GABON",
            "iso3": "GAB",
            "iso2": "GA",
            "grc": "GAB",
            "isonum": "266",
            "country": "Gabon"
        },
        {
            "euname": "GAMBIA",
            "iso3": "GMB",
            "iso2": "GM",
            "grc": "GAM",
            "isonum": "270",
            "country": "Gambia"
        },
        {
            "euname": "GEORGIA",
            "iso3": "GEO",
            "iso2": "GE",
            "grc": "GEO",
            "isonum": "268",
            "country": "Georgia"
        },
        {
            "euname": "Germany",
            "iso3": "DEU",
            "iso2": "DE",
            "grc": "GER",
            "isonum": "276",
            "country": "Germany"
        },
        {
            "euname": "Ghana",
            "iso3": "GHA",
            "iso2": "GH",
            "grc": "GHA",
            "isonum": "288",
            "country": "Ghana"
        },
        {
            "euname": "GIBRALTAR",
            "linked_country": "United Kingdom",
            "iso3": "GIB",
            "iso2": "GI",
            "grc": "GIB",
            "isonum": "292",
            "country": "Gibralter",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Greece",
            "iso3": "GRC",
            "iso2": "GR",
            "grc": "GRE",
            "isonum": "300",
            "country": "Greece"
        },
        {
            "euname": "GREENLAND",
            "linked_country": "Denmark",
            "iso3": "GRL",
            "iso2": "GL",
            "grc": "GRN",
            "isonum": "304",
            "country": "Greenland",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "GRENADA",
            "iso3": "GRD",
            "iso2": "GD",
            "grc": "GRA",
            "isonum": "308",
            "country": "Grenada"
        },
        {
            "euname": "GUADELOUPE",
            "linked_country": "France",
            "iso3": "GLP",
            "iso2": "GP",
            "grc": "GUD",
            "isonum": "312",
            "country": "Guadeloupe",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "linked_country": "United States of America",
            "iso3": "GUM",
            "iso2": "GU",
            "grc": "GUM",
            "isonum": "316",
            "country": "Guam",
            "imperitive": "Geographical"
        },
        {
            "euname": "Guatemala",
            "iso3": "GTM",
            "iso2": "GT",
            "grc": "GUA",
            "isonum": "320",
            "country": "Guatemala"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "GGY",
            "iso2": "GG",
            "grc": "GUE",
            "isonum": "831",
            "country": "Guernsey",
            "imperitive": "Postal"
        },
        {
            "euname": "Guinea",
            "iso3": "GIN",
            "iso2": "GN",
            "grc": "GUI",
            "isonum": "324",
            "country": "Guinea"
        },
        {
            "euname": "GUINEA BISSAU",
            "iso3": "GNB",
            "iso2": "GW",
            "grc": "GUB",
            "isonum": "624",
            "country": "Guinea-Bissau"
        },
        {
            "euname": "GUYANA",
            "iso3": "GUY",
            "iso2": "GY",
            "grc": "GUY",
            "isonum": "328",
            "country": "Guyana"
        },
        {
            "euname": "HAITI",
            "iso3": "HTI",
            "iso2": "HT",
            "grc": "HAI",
            "isonum": "332",
            "country": "Haiti"
        },
        {
            "euname": "HOLY SEE (VATICAN CITY STATE)",
            "iso3": "VAT",
            "iso2": "VA",
            "grc": "VAT",
            "isonum": "336",
            "country": "Holy See"
        },
        {
            "euname": "Honduras",
            "iso3": "HND",
            "iso2": "HN",
            "grc": "HON",
            "isonum": "340",
            "country": "Honduras"
        },
        {
            "euname": "Hong Kong",
            "linked_country": "China",
            "iso3": "HKG",
            "iso2": "HK",
            "grc": "HOK",
            "isonum": "344",
            "country": "Hong Kong",
            "imperitive": "Postal; Currency; Telephone"
        },
        {
            "euname": "Hungary",
            "iso3": "HUN",
            "iso2": "HU",
            "grc": "HUN",
            "isonum": "348",
            "country": "Hungary"
        },
        {
            "euname": "Iceland",
            "iso3": "ISL",
            "iso2": "IS",
            "grc": "ICE",
            "isonum": "352",
            "country": "Iceland"
        },
        {
            "euname": "India",
            "iso3": "IND",
            "iso2": "IN",
            "grc": "IND",
            "isonum": "356",
            "country": "India"
        },
        {
            "euname": "INDONESIA",
            "iso3": "IDN",
            "iso2": "ID",
            "grc": "INO",
            "isonum": "360",
            "country": "Indonesia"
        },
        {
            "euname": "IRAN, ISLAMIC REPUBLIC OF",
            "iso3": "IRN",
            "iso2": "IR",
            "grc": "IRA",
            "isonum": "364",
            "country": "Iran"
        },
        {
            "euname": "IRAQ",
            "iso3": "IRQ",
            "iso2": "IQ",
            "grc": "IRQ",
            "isonum": "368",
            "country": "Iraq"
        },
        {
            "euname": "Ireland",
            "iso3": "IRL",
            "iso2": "IE",
            "grc": "IRE",
            "isonum": "372",
            "country": "Ireland"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "IMN",
            "iso2": "IM",
            "grc": "ISL",
            "isonum": "833",
            "country": "Isle of Man",
            "imperitive": "Postal"
        },
        {
            "euname": "Israel",
            "iso3": "ISR",
            "iso2": "IL",
            "grc": "ISR",
            "isonum": "376",
            "country": "Israel"
        },
        {
            "euname": "Italy",
            "iso3": "ITA",
            "iso2": "IT",
            "grc": "ITA",
            "isonum": "380",
            "country": "Italy"
        },
        {
            "euname": "COTE D'IVOIRE",
            "iso3": "CIV",
            "iso2": "CI",
            "grc": "IVO",
            "isonum": "384",
            "country": "Ivory Coast"
        },
        {
            "euname": "Jamaica",
            "iso3": "JAM",
            "iso2": "JM",
            "grc": "JAM",
            "isonum": "388",
            "country": "Jamaica"
        },
        {
            "euname": "Japan",
            "iso3": "JPN",
            "iso2": "JP",
            "grc": "JAP",
            "isonum": "392",
            "country": "Japan"
        },
        {
            "euname": "JERSEY",
            "linked_country": "United Kingdom",
            "iso3": "JEY",
            "iso2": "JE",
            "grc": "JER",
            "isonum": "832",
            "country": "Jersey",
            "imperitive": "Postal"
        },
        {
            "euname": "JORDAN",
            "iso3": "JOR",
            "iso2": "JO",
            "grc": "JOR",
            "isonum": "400",
            "country": "Jordan"
        },
        {
            "euname": "KAZAKHSTAN",
            "iso3": "KAZ",
            "iso2": "KZ",
            "grc": "KAZ",
            "isonum": "398",
            "country": "Kazakhstan"
        },
        {
            "euname": "Kenya",
            "iso3": "KEN",
            "iso2": "KE",
            "grc": "KEN",
            "isonum": "404",
            "country": "Kenya"
        },
        {
            "euname": "KIRIBATI",
            "iso3": "KIR",
            "iso2": "KI",
            "grc": "KII",
            "isonum": "296",
            "country": "Kiribati"
        },
        {
            "linked_country": "Serbia",
            "iso3": "KOS",
            "grc": "KOS",
            "country": "Kosovo",
            "imperitive": "Postal; Currency; Telephone"
        },
        {
            "euname": "KUWAIT",
            "iso3": "KWT",
            "iso2": "KW",
            "grc": "KUW",
            "isonum": "414",
            "country": "Kuwait"
        },
        {
            "euname": "KYRGYZSTAN",
            "iso3": "KGZ",
            "iso2": "KG",
            "grc": "KIR",
            "isonum": "417",
            "country": "Kyrgyzstan"
        },
        {
            "euname": "LAOS, PEOPLE'S DEMOCRATIC REPUBLIC",
            "iso3": "LAO",
            "iso2": "LA",
            "grc": "LAO",
            "isonum": "418",
            "country": "Laos"
        },
        {
            "euname": "Latvia",
            "iso3": "LVA",
            "iso2": "LV",
            "grc": "LAT",
            "isonum": "428",
            "country": "Latvia"
        },
        {
            "euname": "LEBANON",
            "iso3": "LBN",
            "iso2": "LB",
            "grc": "LEB",
            "isonum": "422",
            "country": "Lebanon"
        },
        {
            "euname": "LESOTHO",
            "iso3": "LSO",
            "iso2": "LS",
            "grc": "LES",
            "isonum": "426",
            "country": "Lesotho"
        },
        {
            "euname": "LIBERIA",
            "iso3": "LBR",
            "iso2": "LR",
            "grc": "LIR",
            "isonum": "430",
            "country": "Liberia"
        },
        {
            "euname": "LIBYA",
            "iso3": "LBY",
            "iso2": "LY",
            "grc": "LIB",
            "isonum": "434",
            "country": "Libya"
        },
        {
            "euname": "LIECHTENSTEIN",
            "iso3": "LIE",
            "iso2": "LI",
            "grc": "LIE",
            "isonum": "438",
            "country": "Liechtenstein"
        },
        {
            "euname": "LITUANIA",
            "iso3": "LTU",
            "iso2": "LT",
            "grc": "LIT",
            "isonum": "440",
            "country": "Lithuania"
        },
        {
            "euname": "Luxembourg",
            "iso3": "LUX",
            "iso2": "LU",
            "grc": "LUX",
            "isonum": "442",
            "country": "Luxembourg"
        },
        {
            "euname": "MACAO",
            "linked_country": "China",
            "iso3": "MAC",
            "iso2": "MO",
            "grc": "MCA",
            "isonum": "446",
            "country": "Macau",
            "imperitive": "Postal; Currency; Telephone"
        },
        {
            "euname": "MACEDONIA, FORMER YUGOSLAV REPUBLIC OF",
            "iso3": "MKD",
            "iso2": "MK",
            "grc": "MCE",
            "isonum": "807",
            "country": "Macedonia"
        },
        {
            "euname": "MADAGASCAR",
            "iso3": "MDG",
            "iso2": "MG",
            "grc": "MAD",
            "isonum": "450",
            "country": "Madagascar"
        },
        {
            "euname": "MALAWI",
            "iso3": "MWI",
            "iso2": "MW",
            "grc": "MAW",
            "isonum": "454",
            "country": "Malawi"
        },
        {
            "euname": "Malaysia",
            "iso3": "MYS",
            "iso2": "MY",
            "grc": "MAA",
            "isonum": "458",
            "country": "Malaysia"
        },
        {
            "euname": "MALDIVES",
            "iso3": "MDV",
            "iso2": "MV",
            "grc": "MAV",
            "isonum": "462",
            "country": "Maldives"
        },
        {
            "euname": "MALI",
            "iso3": "MLI",
            "iso2": "ML",
            "grc": "MAI",
            "isonum": "466",
            "country": "Mali"
        },
        {
            "euname": "Malta",
            "iso3": "MLT",
            "iso2": "MT",
            "grc": "MAL",
            "isonum": "470",
            "country": "Malta"
        },
        {
            "euname": "MARSHALL ISLANDS",
            "iso3": "MHL",
            "iso2": "MH",
            "grc": "MAR",
            "isonum": "584",
            "country": "Marshall Islands"
        },
        {
            "euname": "MARTINIQUE",
            "linked_country": "France",
            "iso3": "MTQ",
            "iso2": "MQ",
            "grc": "MAN",
            "isonum": "474",
            "country": "Martinique",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "Mauritania",
            "iso3": "MRT",
            "iso2": "MR",
            "grc": "MAU",
            "isonum": "478",
            "country": "Mauritania"
        },
        {
            "euname": "MAURITIUS",
            "iso3": "MUS",
            "iso2": "MU",
            "grc": "MAT",
            "isonum": "480",
            "country": "Mauritius"
        },
        {
            "euname": "MAYOTTE",
            "linked_country": "France",
            "iso3": "MYT",
            "iso2": "YT",
            "grc": "MAY",
            "isonum": "175",
            "country": "Mayotte",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "Mexico",
            "iso3": "MEX",
            "iso2": "MX",
            "grc": "MEX",
            "isonum": "484",
            "country": "Mexico"
        },
        {
            "euname": "MICRONESIA, FEDERATED STATES OF",
            "iso3": "FSM",
            "iso2": "FM",
            "grc": "MIC",
            "isonum": "583",
            "country": "Micronesia"
        },
        {
            "euname": "MOLDOVA, REPUBLIC OF",
            "iso3": "MDA",
            "iso2": "MD",
            "grc": "MOL",
            "isonum": "498",
            "country": "Moldova"
        },
        {
            "euname": "Monaco",
            "iso3": "MCO",
            "iso2": "MC",
            "grc": "MON",
            "isonum": "492",
            "country": "Monaco"
        },
        {
            "euname": "MONGOLIA",
            "iso3": "MNG",
            "iso2": "MN",
            "grc": "MOG",
            "isonum": "496",
            "country": "Mongolia"
        },
        {
            "euname": "Montenegro",
            "iso3": "MNE",
            "iso2": "ME",
            "grc": "MOE",
            "isonum": "499",
            "country": "Montenegro"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "MSR",
            "iso2": "MS",
            "grc": "MOT",
            "isonum": "500",
            "country": "Montserrat",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Morocco",
            "iso3": "MAR",
            "iso2": "MA",
            "grc": "MOR",
            "isonum": "504",
            "country": "Morocco"
        },
        {
            "euname": "Mozambique",
            "iso3": "MOZ",
            "iso2": "MZ",
            "grc": "MOZ",
            "isonum": "508",
            "country": "Mozambique"
        },
        {
            "euname": "Myanmar",
            "iso3": "MMR",
            "iso2": "MM",
            "grc": "BUR",
            "isonum": "104",
            "country": "Myanmar"
        },
        {
            "euname": "NAMIBIA",
            "iso3": "NAM",
            "iso2": "NA",
            "grc": "NAM",
            "isonum": "516",
            "country": "Namibia"
        },
        {
            "euname": "NAURU",
            "iso3": "NRU",
            "iso2": "NR",
            "grc": "NAU",
            "isonum": "520",
            "country": "Nauru"
        },
        {
            "euname": "NEPAL",
            "iso3": "NPL",
            "iso2": "NP",
            "grc": "NEP",
            "isonum": "524",
            "country": "Nepal"
        },
        {
            "euname": "Netherlands Antilles",
            "iso3": "ANT",
            "iso2": "AN",
            "grc": "NAN",
            "isonum": "530",
            "country": "Netherlands Antilles",
            "imperitive": "Legacy"
        },
        {
            "euname": "Netherlands",
            "iso3": "NLD",
            "iso2": "NL",
            "grc": "NET",
            "isonum": "528",
            "country": "Netherlands"
        },
        {
            "euname": "NEW CALEDONIA",
            "linked_country": "France",
            "iso3": "NCL",
            "iso2": "NC",
            "grc": "NCA",
            "isonum": "540",
            "country": "New Caledonia",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "NEW ZEALAND",
            "iso3": "NZL",
            "iso2": "NZ",
            "grc": "NEW",
            "isonum": "554",
            "country": "New Zealand"
        },
        {
            "euname": "Nicaragua",
            "iso3": "NIC",
            "iso2": "NI",
            "grc": "NIC",
            "isonum": "558",
            "country": "Nicaragua"
        },
        {
            "euname": "Niger",
            "iso3": "NER",
            "iso2": "NE",
            "grc": "NIE",
            "isonum": "562",
            "country": "Niger"
        },
        {
            "euname": "Nigeria",
            "iso3": "NGA",
            "iso2": "NG",
            "grc": "NIG",
            "isonum": "566",
            "country": "Nigeria"
        },
        {
            "euname": "NIUE",
            "iso3": "NIU",
            "iso2": "NU",
            "grc": "NIU",
            "isonum": "570",
            "country": "Niue"
        },
        {
            "linked_country": "Australia",
            "iso3": "NFK",
            "iso2": "NF",
            "grc": "NOF",
            "isonum": "574",
            "country": "Norfolk Island",
            "imperitive": "Geographical; Telephone"
        },
        {
            "euname": "KOREA, PEOPLE'S DEMOCRATIC REPUBLIC OF",
            "iso3": "PRK",
            "iso2": "KP",
            "grc": "NKO",
            "isonum": "408",
            "country": "North Korea"
        },
        {
            "linked_country": "United States of America",
            "iso3": "MNP",
            "iso2": "MP",
            "grc": "NMI",
            "isonum": "580",
            "country": "Northern Mariana Islands",
            "imperitive": "Geographical"
        },
        {
            "euname": "Norway",
            "iso3": "NOR",
            "iso2": "NO",
            "grc": "NOR",
            "isonum": "578",
            "country": "Norway"
        },
        {
            "euname": "OMAN",
            "iso3": "OMN",
            "iso2": "OM",
            "grc": "OMA",
            "isonum": "512",
            "country": "Oman"
        },
        {
            "euname": "Pakistan",
            "iso3": "PAK",
            "iso2": "PK",
            "grc": "PAK",
            "isonum": "586",
            "country": "Pakistan"
        },
        {
            "euname": "PALAU",
            "iso3": "PLW",
            "iso2": "PW",
            "grc": "PAL",
            "isonum": "585",
            "country": "Palau"
        },
        {
            "euname": "PALESTINIAN OCCUPIED TERRITORY",
            "linked_country": "Israel",
            "iso3": "PSE",
            "iso2": "PS",
            "grc": "PLA",
            "isonum": "275",
            "country": "Palestinian Territories"
        },
        {
            "euname": "PANAMA",
            "iso3": "PAN",
            "iso2": "PA",
            "grc": "PAN",
            "isonum": "591",
            "country": "Panama"
        },
        {
            "euname": "PAPUA NEW GUINEA",
            "iso3": "PNG",
            "iso2": "PG",
            "grc": "PAP",
            "isonum": "598",
            "country": "Papua New Guinea"
        },
        {
            "euname": "PARAGUAY",
            "iso3": "PRY",
            "iso2": "PY",
            "grc": "PAR",
            "isonum": "600",
            "country": "Paraguay"
        },
        {
            "euname": "PERU",
            "iso3": "PER",
            "iso2": "PE",
            "grc": "PER",
            "isonum": "604",
            "country": "Peru"
        },
        {
            "euname": "Philippines",
            "iso3": "PHL",
            "iso2": "PH",
            "grc": "PHI",
            "isonum": "608",
            "country": "Philippines"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "PCN",
            "iso2": "PN",
            "grc": "PIT",
            "isonum": "612",
            "country": "Pitcairn Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Poland",
            "iso3": "POL",
            "iso2": "PL",
            "grc": "POL",
            "isonum": "616",
            "country": "Poland"
        },
        {
            "euname": "Portugal",
            "iso3": "PRT",
            "iso2": "PT",
            "grc": "POR",
            "isonum": "620",
            "country": "Portugal"
        },
        {
            "euname": "PUERTO RICO",
            "linked_country": "United States",
            "iso3": "PRI",
            "iso2": "PR",
            "grc": "PUE",
            "isonum": "630",
            "country": "Puerto Rico",
            "imperitive": "Geographical"
        },
        {
            "euname": "QATAR",
            "iso3": "QAT",
            "iso2": "QA",
            "grc": "QAT",
            "isonum": "634",
            "country": "Qatar"
        },
        {
            "euname": "Romania",
            "iso3": "ROU",
            "iso2": "RO",
            "grc": "ROM",
            "isonum": "642",
            "country": "Romania"
        },
        {
            "euname": "RUSSIA, FEDERATION OF",
            "iso3": "RUS",
            "iso2": "RU",
            "grc": "RUS",
            "isonum": "643",
            "country": "Russia"
        },
        {
            "euname": "RUANDA",
            "iso3": "RWA",
            "iso2": "RW",
            "grc": "RWA",
            "isonum": "646",
            "country": "Rwanda"
        },
        {
            "euname": "REUNION",
            "linked_country": "France",
            "iso3": "REU",
            "iso2": "RE",
            "grc": "REU",
            "isonum": "638",
            "country": "Réunion",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "linked_country": "The Netherlands",
            "iso3": "BES",
            "iso2": "BQ",
            "grc": "SAB",
            "isonum": "535",
            "country": "Saba",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "linked_country": "France",
            "iso3": "BLM",
            "iso2": "BL",
            "grc": "STB",
            "isonum": "652",
            "country": "Saint Barthélemy",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "SAINT KITTS AND NEVIS",
            "iso3": "KNA",
            "iso2": "KN",
            "grc": "STC",
            "isonum": "659",
            "country": "Saint Christopher & Nevis"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "SHN",
            "iso2": "SH",
            "grc": "STH",
            "isonum": "654",
            "country": "Saint Helena",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "SAINT LUCIA",
            "iso3": "LCA",
            "iso2": "LC",
            "grc": "STL",
            "isonum": "662",
            "country": "Saint Lucia"
        },
        {
            "linked_country": "France",
            "iso3": "MAF",
            "iso2": "MF",
            "grc": "STM",
            "isonum": "663",
            "country": "Saint Martin",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "linked_country": "France",
            "iso3": "SPM",
            "iso2": "PM",
            "grc": "SPM",
            "isonum": "666",
            "country": "Saint Pierre & Miquelon",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "SAINT VINCENT AND THE GRENADINES",
            "iso3": "VCT",
            "iso2": "VC",
            "grc": "STV",
            "isonum": "670",
            "country": "Saint Vincent & The Grenadines"
        },
        {
            "euname": "SAMOA",
            "iso3": "WSM",
            "iso2": "WS",
            "grc": "WSM",
            "isonum": "882",
            "country": "Samoa"
        },
        {
            "euname": "SAINT MARINO",
            "iso3": "SMR",
            "iso2": "SM",
            "grc": "SAN",
            "isonum": "674",
            "country": "San Marino"
        },
        {
            "euname": "SAO TOME AND PRINCIPE",
            "iso3": "STP",
            "iso2": "ST",
            "grc": "SAO",
            "isonum": "678",
            "country": "Sao Tome & Principe"
        },
        {
            "euname": "SUADI ARABIA",
            "iso3": "SAU",
            "iso2": "SA",
            "grc": "SAU",
            "isonum": "682",
            "country": "Saudi Arabia"
        },
        {
            "euname": "Senegal",
            "iso3": "SEN",
            "iso2": "SN",
            "grc": "SEN",
            "isonum": "686",
            "country": "Senegal"
        },
        {
            "euname": "Serbia",
            "iso3": "SRB",
            "iso2": "RS",
            "grc": "YUG",
            "isonum": "688",
            "country": "Serbia"
        },
        {
            "euname": "SEYCHELLES",
            "iso3": "SYC",
            "iso2": "SC",
            "grc": "SEY",
            "isonum": "690",
            "country": "Seychelles"
        },
        {
            "euname": "SIERRA LEONE",
            "iso3": "SLE",
            "iso2": "SL",
            "grc": "SIE",
            "isonum": "694",
            "country": "Sierra Leone"
        },
        {
            "euname": "SINGAPORE",
            "iso3": "SGP",
            "iso2": "SG",
            "grc": "SIN",
            "isonum": "702",
            "country": "Singapore"
        },
        {
            "linked_country": "The Netherlands",
            "iso3": "BES",
            "iso2": "BQ",
            "grc": "STE",
            "isonum": "535",
            "country": "Sint Eustatius",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "linked_country": "The Netherlands",
            "iso3": "SXM",
            "iso2": "SX",
            "grc": "SMA",
            "isonum": "534",
            "country": "Sint Maarten",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "Slovakia",
            "iso3": "SVK",
            "iso2": "SK",
            "grc": "SLO",
            "isonum": "703",
            "country": "Slovakia"
        },
        {
            "euname": "Slovenia",
            "iso3": "SVN",
            "iso2": "SI",
            "grc": "SLV",
            "isonum": "705",
            "country": "Slovenia"
        },
        {
            "euname": "SOLOMON ISLANDS",
            "iso3": "SLB",
            "iso2": "SB",
            "grc": "SOL",
            "isonum": "90",
            "country": "Solomon Islands"
        },
        {
            "euname": "SOMALIA",
            "iso3": "SOM",
            "iso2": "SO",
            "grc": "SOM",
            "isonum": "706",
            "country": "Somalia"
        },
        {
            "euname": "South Africa",
            "iso3": "ZAF",
            "iso2": "ZA",
            "grc": "SAF",
            "isonum": "710",
            "country": "South Africa"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "SGS",
            "iso2": "GS",
            "grc": "SGE",
            "isonum": "239",
            "country": "South Georgia & The South Sandwish Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "KOREA, REPUBLIC OF",
            "iso3": "KOR",
            "iso2": "KR",
            "grc": "SKO",
            "isonum": "418",
            "country": "South Korea"
        },
        {
            "euname": "SOUTH SUDAN",
            "iso3": "SSD",
            "iso2": "SS",
            "grc": "SSU",
            "country": "South Sudan"
        },
        {
            "euname": "Spain",
            "iso3": "ESP",
            "iso2": "ES",
            "grc": "SPA",
            "isonum": "724",
            "country": "Spain"
        },
        {
            "euname": "SRI LANKA",
            "iso3": "LKA",
            "iso2": "LK",
            "grc": "SRI",
            "isonum": "144",
            "country": "Sri Lanka"
        },
        {
            "euname": "Sudan",
            "iso3": "SDN",
            "iso2": "SD",
            "grc": "SUD",
            "isonum": "736",
            "country": "Sudan"
        },
        {
            "euname": "SURINAM",
            "iso3": "SUR",
            "iso2": "SR",
            "grc": "SUR",
            "isonum": "740",
            "country": "Suriname"
        },
        {
            "euname": "SWAZILAND",
            "iso3": "SWZ",
            "iso2": "SZ",
            "grc": "SWA",
            "isonum": "748",
            "country": "Swaziland"
        },
        {
            "euname": "Sweden",
            "iso3": "SWE",
            "iso2": "SE",
            "grc": "SWE",
            "isonum": "752",
            "country": "Sweden"
        },
        {
            "euname": "Switzerland",
            "iso3": "CHE",
            "iso2": "CH",
            "grc": "SWI",
            "isonum": "756",
            "country": "Switzerland"
        },
        {
            "euname": "SYRIA, ARAB REPUBLIC",
            "iso3": "SYR",
            "iso2": "SY",
            "grc": "SYR",
            "isonum": "760",
            "country": "Syria"
        },
        {
            "euname": "TAIWAN",
            "linked_country": "China",
            "iso3": "TWN",
            "iso2": "TW",
            "grc": "TAI",
            "isonum": "158",
            "country": "Taiwan"
        },
        {
            "euname": "TAJIKISTAN",
            "iso3": "TJK",
            "iso2": "TJ",
            "grc": "TAJ",
            "isonum": "762",
            "country": "Tajikistan"
        },
        {
            "euname": "TANZANIA, UNITED RE UBLIC OF",
            "iso3": "TZA",
            "iso2": "TZ",
            "grc": "TAN",
            "isonum": "834",
            "country": "Tanzania"
        },
        {
            "euname": "THAILAND",
            "iso3": "THA",
            "iso2": "TH",
            "grc": "THA",
            "isonum": "764",
            "country": "Thailand"
        },
        {
            "euname": "TOGO",
            "iso3": "TGO",
            "iso2": "TG",
            "grc": "TOG",
            "isonum": "768",
            "country": "Togo"
        },
        {
            "linked_country": "New Zealand",
            "iso3": "TKL",
            "iso2": "TK",
            "grc": "TOK",
            "isonum": "772",
            "country": "Tokelau",
            "imperitive": "Geographical; Postal; Telephone"
        },
        {
            "euname": "TONGA",
            "iso3": "TON",
            "iso2": "TO",
            "grc": "TON",
            "isonum": "776",
            "country": "Tonga"
        },
        {
            "euname": "TRINIDAD AND TOBAGO",
            "iso3": "TTO",
            "iso2": "TT",
            "grc": "TRI",
            "isonum": "780",
            "country": "Trinidad & Tobago"
        },
        {
            "euname": "Tunisia",
            "iso3": "TUN",
            "iso2": "TN",
            "grc": "TUN",
            "isonum": "788",
            "country": "Tunisia"
        },
        {
            "euname": "Turkey",
            "iso3": "TUR",
            "iso2": "TR",
            "grc": "TUR",
            "isonum": "792",
            "country": "Turkey"
        },
        {
            "euname": "TURKMENISTAN",
            "iso3": "TKM",
            "iso2": "TM",
            "grc": "TUK",
            "isonum": "795",
            "country": "Turkmenistan"
        },
        {
            "linked_country": "United Kingdom",
            "iso3": "TCA",
            "iso2": "TC",
            "grc": "TUC",
            "isonum": "796",
            "country": "Turks & Caicos Islands",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "TUVALU",
            "iso3": "TUV",
            "iso2": "TV",
            "grc": "TUV",
            "isonum": "798",
            "country": "Tuvalu"
        },
        {
            "euname": "Uganda",
            "iso3": "UGA",
            "iso2": "UG",
            "grc": "UGA",
            "isonum": "800",
            "country": "Uganda"
        },
        {
            "euname": "Ukraine",
            "iso3": "UKR",
            "iso2": "UA",
            "grc": "UKR",
            "isonum": "804",
            "country": "Ukraine"
        },
        {
            "euname": "United Arab Emirates",
            "iso3": "ARE",
            "iso2": "AE",
            "grc": "UAE",
            "isonum": "784",
            "country": "United Arab Emirates"
        },
        {
            "euname": "United Kingdom",
            "iso3": "GBR",
            "iso2": "GB",
            "grc": "UNI",
            "isonum": "826",
            "country": "United Kingdom"
        },
        {
            "euname": "United States",
            "iso3": "USA",
            "iso2": "US",
            "grc": "USA",
            "isonum": "840",
            "country": "United States"
        },
        {
            "euname": "US VIRGIN ISLANDS",
            "linked_country": "United States of America",
            "iso3": "VIR",
            "iso2": "VI",
            "grc": "VIR",
            "isonum": "850",
            "country": "United States Virgin Islands",
            "imperitive": "Geographical"
        },
        {
            "euname": "URUGUAY",
            "iso3": "URY",
            "iso2": "UY",
            "grc": "URU",
            "isonum": "858",
            "country": "Uruguay"
        },
        {
            "euname": "UZBEKISTAN",
            "iso3": "UZB",
            "iso2": "UZ",
            "grc": "UZB",
            "isonum": "860",
            "country": "Uzbekistan"
        },
        {
            "euname": "VANUATU",
            "iso3": "VUT",
            "iso2": "VU",
            "grc": "VAN",
            "isonum": "548",
            "country": "Vanuatu"
        },
        {
            "euname": "VENEZUELA",
            "iso3": "VEN",
            "iso2": "VE",
            "grc": "VEN",
            "isonum": "862",
            "country": "Venezuela"
        },
        {
            "euname": "VIETNAM",
            "iso3": "VNM",
            "iso2": "VN",
            "grc": "VIE",
            "isonum": "704",
            "country": "Vietnam"
        },
        {
            "linked_country": "France",
            "iso3": "WLF",
            "iso2": "WF",
            "grc": "WAL",
            "isonum": "876",
            "country": "Wallis & Futuna",
            "imperitive": "Geographical; Postal; Currency; Telephone"
        },
        {
            "euname": "WESTERN SAHARA",
            "linked_country": "Morocco",
            "iso3": "ESH",
            "iso2": "EH",
            "grc": "WSA",
            "isonum": "732",
            "country": "Western Sahara",
            "imperitive": "Political"
        },
        {
            "euname": "Yemen",
            "iso3": "YEM",
            "iso2": "YE",
            "grc": "YEM",
            "isonum": "887",
            "country": "Yemen"
        },
        {
            "euname": "ZAMBIA",
            "iso3": "ZMB",
            "iso2": "ZM",
            "grc": "ZAM",
            "isonum": "894",
            "country": "Zambia"
        },
        {
            "euname": "ZIMBABWE",
            "iso3": "ZWE",
            "iso2": "ZW",
            "grc": "ZIM",
            "isonum": "716",
            "country": "Zimbabwe"
        }
    ],
    actions:{
//        /*     ***infinite scroll***     */
        getMore: function() {
            if (this.get('loadingMore')) { return; } // don't load new data if we already are
            this.set('loadingMore', true);

            this.get('target').send('getMore'); // pass this action up the chain to the events hash on the route
        },

        gotMore: function(items, page) {
            this.set('loadingMore', false);
            this.set('page', page);
            //this.pushObjects(items);
        },

        /*     ***logout***     */
        logout: function(){
            this.set('grantsValue', null);
            this.set('user_record', null);
            this.set('userId', null);
            this.set('token', null);
            this.globals.set('token', this.token);
            this.set('username', null);
            this.set('selectedDepot', null);
            this.set('userProfile', null);
            this.set('company', null);
            this.set('companyType', null);
            this.set('isAdmin', null);

            localStorage.removeItem('user_record');

            localStorage.removeItem('grantsValue');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('selectedDepot');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('company');
            localStorage.removeItem('companyType');
            localStorage.removeItem('isAdmin');

            localStorage.clear();

            this.transitionToRoute('login/main');
        }
    }
});


//unique function
Array.prototype.unique = function () {
    var r = [];
    o:for(var i = 0, n = this.length; i < n; i++)
    {
        for(var x = 0, y = r.length; x < y; x++)
        {
            if(r[x]===this[i])
            {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
};

