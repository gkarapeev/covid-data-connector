var myConnector = tableau.makeConnector();

myConnector.getSchema = function(schemaCallback) {
    var cols = [
        {
            id: "authors",
            alias: "Authors",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "doi",
            alias: "DOI",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "first_pub_date",
            alias: "First Publication Date",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "journal_name",
            alias: "Journal Name",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "open_access",
            alias: "Open Access",
            dataType: tableau.dataTypeEnum.bool
        },
        {
            id: "pub_month",
            alias: "Publication Month",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "pub_year",
            alias: "Publication Year",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "source",
            alias: "Source",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "times_cited",
            alias: "Times Cited",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "title",
            alias: "Title",
            dataType: tableau.dataTypeEnum.string
        },
    ];

    var tableSchema = {
        id: "covidData",
        alias: "Covid data description",
        columns: cols
    };

    schemaCallback([tableSchema]);
};

var selectedQuery;

const mapItem = item => ({
    authors: item.authorString || 'N/a',
    doi: item.doi || 'N/a',
    first_pub_date: item.firstPublicationDate || 'N/a',
    journal_name: item.journalInfo && item.journalInfo.journal && item.journalInfo.journal.title || 'N/a',
    open_access: (item.isOpenAccess && item.isOpenAccess === "Y" ? true : false) || 'N/a',
    pub_month: item.journalInfo ? item.journalInfo.monthOfPublication : 'N/a',
    pub_year: item.pubYear && parseInt(item.pubYear) || 'N/a',
    source: item.source || 'N/a',
    times_cited: item.citedByCount || 'N/a',
    title: item.title || 'N/a',
});

const getAllPages = async (query) => {
    let data = [];
    let next = "*";
    let lastNext;

    while (next && next !== lastNext) {
        let res = await getSinglePage(next, query);
        const newItems = res.resultList.result.map(mapItem);
        data.push(...newItems);

        lastNext = next;
        next = res.nextCursorMark;
    }

    return data;
}

const getSinglePage = async (nextCursor, query) => {
    const pageSize = 1000;

    const queries = {
        1: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28Africa%20OR%20%22Basic%20service%22%20OR%20class%20OR%20%22Developing%20country%22%20OR%20%22Disadvantaged%20Economic%20resources%22%20OR%20environment%20OR%20equality%20OR%20%22Financial%20inclusion%22%20OR%20income%20OR%20microfinance%20OR%20%22Non-discrimination%22%20OR%20poor%20OR%20poverty%20OR%20%22Quality%20of%20Life%22%20OR%20resources%20OR%20%22social%20protection%22%20OR%20sustainable%20OR%20%22third%20World%22%20OR%20vulnerable%20OR%20%22Wealth%20distribution%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        2: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Agricultural%20Orientation%20index%22%20OR%20%22Agricultural%20productivity%22%20OR%20agriculture%20OR%20consume%20OR%20%22Crop%20diversity%22%20AND%20%22Crops%22%20OR%20%22Doha%20Development%20Round%22%20OR%20%22Doha%20Round%22%20OR%20%22End%20hunger%22%20OR%20environment%20OR%20food%20OR%20%22Genetic%20diversity%22%20OR%20genetics%20OR%20hunger%20OR%20%22Hungry%20people%22%20OR%20%22Improved%20nutrition%22%20OR%20%22Innovations%20and%20health%22%20OR%20legumes%20OR%20maize%20OR%20malnourished%20OR%20malnutrition%20OR%20nutrition%20OR%20%22Nutritional%20needs%22%20OR%20nutritious%20OR%20poverty%20OR%20produce%20OR%20productivity%20OR%20%22Quality%20of%20life%22%20OR%20%22Resilient%20agriculture%22%20OR%20%22Rural%20infrastructure%22%20OR%20%22Small-scale%20food%20producers%22%20OR%20%22Stunted%20growth%22%20OR%20stunting%20OR%20%22Sufficient%20food%22%20OR%20sustainable%20OR%20%22Trade%20diversity%22%20OR%20%22Trade%20restrictions%22%20OR%20%22Under%20nourished%22%20OR%20undernourished%20OR%20wasting%20OR%20%22World%27s%20hungry%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        3: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22access%20to%20clean%20water%20and%20sanitation%22%20OR%20%22affordable%20medicines%22%20OR%20aids%20OR%20%22cardiovascular%20disease%22%20OR%20cancer%20OR%20diabetes%20OR%20%22chronic%20respiratory%20disease%22%20OR%20%22air%20contamination%22%20OR%20%22Air%20pollution%22%20OR%20%22Alcohol%20abuse%22%20OR%20%22Antenatal%20care%22%20OR%20antiretroviral%20OR%20%22Antiretroviral%20therapy%22%20OR%20biomedical%20OR%20%22bodily%20autonomy%22%20OR%20%22Child%20deaths%22%20OR%20%22Contraceptive%20use%22%20OR%20%22Death%20rate%22%20OR%20dental%20OR%20%22Disability%20and%20family%20support%22%20OR%20%22disability%20and%20inclusion%22%20OR%20%22disability%20and%20politics%20of%20location%22%20OR%20diseases%20OR%20%22family%20planning%22%20OR%20health%20OR%20hepatitis%20OR%20hiv%20OR%20%22improving%20mortality%22%20OR%20%22increasing%20life%20expectancy%22%20OR%20indigenous%20OR%20infected%20OR%20%22international%20health%20policy%22%20OR%20%22international%20health%20regulations%22%20OR%20malaria%20OR%20%22Maternal%20mortality%22%20OR%20measles%20OR%20medical%20OR%20mortality%20OR%20%22Narcotic%20drug%20abuse%22%20OR%20%22Neonatal%20mortality%22%20OR%20polio%20OR%20%22Road%20traffic%20accidents%22%20OR%20%22soil%20contamination%22%20OR%20%22Soil%20pollution%22%20OR%20%22tobacco%20control%22%20OR%20%22treatment%20of%20substance%20abuse%22%20OR%20tuberculosis%20OR%20vaccines%20OR%20violence%20OR%20wash%20OR%20%22Water%20Sanitation%20and%20Hygiene%20for%20All%22%20OR%20%22Water-borne%20disease%22%20OR%20wellbeing%20OR%20%22well%20being%22%20OR%20%22well-being%22%20OR%20%22World%20Health%20Organization%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        4: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Cultural%20diversity%22%20OR%20disability%20OR%20%22Early%20childhood%22%20OR%20education%20OR%20%22Enrolment%22%20OR%20%22Equal%20access%22%20OR%20%22Gender%20disparity%22%20OR%20%22Gender%20equality%22%20OR%20%22Gender%20equity%22%20OR%20%22Gender%20sensitive%22%20OR%20%22Global%20citizenship%22%20OR%20inclusive%20OR%20innovation%20OR%20%22International%20cooperation%22%20OR%20%22Learning%20opportunities%22%20OR%20%22Lifelong%20learning%22%20OR%20literacy%20OR%20numeracy%20OR%20%22Qualified%20teachers%22%20OR%20%22Refugees%20and%20learning%22%20OR%20scholarships%20OR%20school%20OR%20%22Teacher%20training%22%20OR%20%22Vocational%20training%22%20OR%20vulnerable%20OR%20%22Women%27s%20rights%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        5: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Basic%20living%20standards%22%20OR%20dignity%20OR%20disadvantaged%20OR%20discrimination%20OR%20employment%20OR%20%22Empower%20girls%22%20OR%20empowerment%2a%20OR%20%22Equal%20access%22%20OR%20%22Equal%20opportunities%22%20OR%20equality%20OR%20exploitation%20OR%20%22Female%20genital%20mutilation%22%20OR%20feminism%20OR%20%22Forced%20marriage%22%20OR%20gender%20OR%20%22Human%20rights%22%20OR%20humanitarian%20OR%20marginalised%20OR%20parity%20OR%20pay%20OR%20%22Reproductive%20rights%22%20OR%20%22Sexual%20and%20reproductive%20health%22%20OR%20%22Sexual%20exploitation%22%20OR%20%22Sexual%20violence%22%20OR%20%22Social%20inclusion%22%20OR%20trafficking%20OR%20%22Universal%20health%20coverage%22%20OR%20%22Violence%22%20OR%20women%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        6: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28aquifer%20OR%20cities%20OR%20contaminated%20OR%20defecation%20OR%20desalination%20OR%20%22Diarrhoeal%20diseases%22%20OR%20drought%20OR%20dumping%20OR%20%22Ecosystem%20protection%22%20OR%20%22Ecosystem%20restoration%22%20OR%20%22Equitable%20sanitation%22%20OR%20floods%20OR%20hydropower%20OR%20hygiene%20OR%20infrastructure%20OR%20irrigation%20OR%20lakes%20OR%20latrines%20OR%20%22Open%20defecation%22%20OR%20pollution%20OR%20reuse%20OR%20%22River%20basins%22%20OR%20rivers%20OR%20sanitation%20OR%20%22Sewerage%22%20OR%20%22Sustainable%20withdrawals%22%20OR%20%22Third%20world%22%20OR%20toilets%20OR%20%22Untreated%20wastewater%22%20OR%20urban%20OR%20waste%20OR%20wastewater%20OR%20%22Water%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        7: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Animal%20waste%22%20OR%20battery%20OR%20carbon%20OR%20charcoal%20OR%20%22Clean%20fuel%20technology%22%20OR%20%22Clean%20fuels%22%20OR%20%22Cleaner%20fossil%20fuel%20technology%22%20OR%20%22Climate%20goal%22%20OR%20coal%20OR%20electricity%20OR%20emissions%20OR%20energy%20OR%20%22Fossil-fuel%22%20OR%20%22Green%20economy%22%20OR%20%22Greenhouse%20gas%22%20OR%20hydroelectric%20OR%20%22Low%20carbon%22%20OR%20renewable%20OR%20solar%20OR%20%22Sustainable%20power%22%20OR%20vehicles%20OR%20wave%20OR%20wind%20OR%20wood%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        8: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Aid%20for%20trade%22%20OR%20banking%20OR%20%22Child%20labour%22%20OR%20%22Child%20soldiers%22%20OR%20%22Creativity%20and%20innovation%22%20OR%20culture%20OR%20%22Development%20oriented%20policy%22%20OR%20%22Economic%20growth%22%20OR%20%22Economic%20productivity%22%20OR%20economy%20OR%20enterprises%20OR%20entrepreneurship%20OR%20%22Equal%20pay%22%20OR%20finance%20OR%20%22Financial%20services%22%20OR%20%22Forced%20labour%22%20OR%20%22GDP%20growth%22%20OR%20%22Global%20resource%20efficiency%22%20OR%20%22Global%20trade%22%20OR%20%22Gross%20domestic%20product%20growth%22%20OR%20%22Human%20trafficking%22%20OR%20%22Inclusive%20economic%20growth%22%20OR%20innovation%20OR%20insurance%20OR%20%22Job%20creation%22%20OR%20jobs%20OR%20%22Labour%20market%22%20OR%20%22Labour%20rights%22%20OR%20%22Migrant%20workers%22%20OR%20%22Modern%20slavery%22%20OR%20%22Poverty%20eradication%22%20OR%20%22Poverty%20line%22%20OR%20%22Productive%20employment%22%20OR%20productivity%20OR%20%22Public%20policy%22%20OR%20%22Quality%20jobs%22%20OR%20%22Quality%20of%20life%22%20OR%20%22Resource%20efficiency%22%20OR%20slavery%20OR%20%22Social%20policies%22%20OR%20society%20OR%20%22Stable%20employment%22%20OR%20%22Stable%20jobs%22%20OR%20%22Sustainable%20consumption%22%20OR%20%22Sustainable%20economic%20growth%22%20OR%20%22Sustainable%20production%22%20OR%20%22Sustainable%20tourism%22%20OR%20trade%20OR%20unemployment%20OR%20%22Women%20migrants%22%20OR%20work%20OR%20%22World%20trade%22%20OR%20%22Youth%20employment%22%20OR%20%22Youth%20unemployment%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        9: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Access%20to%20the%20internet%22%20OR%20%22Affordable%20access%22%20OR%20%22Affordable%20credit%22%20OR%20%22Clean%20technologies%22%20OR%20cooperation%20OR%20%22Data%20banks%22%20OR%20%22Economic%20development%22%20OR%20%22Electrical%20power%22%20OR%20energy%20OR%20enterprises%20OR%20%22Environmentally%20sound%20technologies%22%20OR%20%22Financial%20services%22%20OR%20%22Industrial%20diversification%22%20OR%20industrialisation%20OR%20%22Information%20and%20communication%20technology%22%20OR%20infrastructure%20OR%20innovation%20OR%20%22Internet%20access%22%20OR%20irrigation%20OR%20%22Knowledge%20in%20education%20for%20all%22%20OR%20%22Mobile%20networks%20in%20developing%20countries%22%20OR%20%22National%20Security%22%20OR%20%22Phone%20service%22%20OR%20%22Public%20policy%22%20OR%20%22Quality%20of%20life%22%20OR%20%22Resource%20use%20efficiency%22%20OR%20roads%20OR%20sanitation%20OR%20%22Scientific%20research%22%20OR%20society%20OR%20%22Technological%20capabilities%22%20OR%20technology%20OR%20trade%20OR%20transport%20OR%20%22Value%20chains%22%20OR%20%22Water%20resources%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        10: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Affordable%20housing%22%20OR%20age%20OR%20ageism%20OR%20business%20OR%20children%20OR%20culture%20OR%20%22Developing%20countries%22%20OR%20%22Developing%20states%22%20OR%20%22Development%20assistance%22%20OR%20disabilities%20OR%20discrimination%20OR%20discriminatory%20OR%20economy%20OR%20education%20OR%20empower%20OR%20%22Equal%20opportunity%22%20OR%20equality%20OR%20equity%20OR%20ethnicity%20OR%20%22Financial%20assistance%22%20OR%20%22Foreign%20aid%22%20OR%20%22Foreign%20investment%22%20OR%20gender%20OR%20%22Global%20financial%20markets%22%20OR%20health%20OR%20homelessness%20OR%20homophobia%20OR%20%22Human%20rights%22%20OR%20inclusion%20OR%20%22Income%20growth%22%20OR%20%22Income%20inequality%22%20OR%20indigenous%20OR%20inequalities%20OR%20inequality%20OR%20%22Migrant%20remittance%22%20OR%20migration%20OR%20%22Population%20growth%22%20OR%20poverty%20OR%20%22Public%20policy%22%20OR%20%22Quality%20of%20life%22%20OR%20race%20OR%20racism%20OR%20religion%20OR%20rural%20OR%20sex%20OR%20sexism%20OR%20%22Social%20protection%22%20OR%20society%20OR%20%22Vulnerable%20nations%22%20OR%20%22World%20trade%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        11: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28adaptable%20OR%20adaptation%20OR%20%22Affordable%20housing%22%20OR%20%22Air%20pollution%22%20OR%20%22Air%20quality%22%20OR%20cities%20OR%20%22Climate%20change%22%20OR%20community%20OR%20%22Cultural%20heritage%22%20OR%20decentralisation%20OR%20%22Development%20planning%22%20OR%20%22Disaster%20management%22%20OR%20%22Disaster%20risk%20reduction%22%20OR%20%22Disaster%20Strategy%22%20OR%20disasters%20OR%20%22Fine%20particulate%20matter%22%20OR%20%22Green%20spaces%22%20OR%20heritage%20OR%20housing%20OR%20%22Human%20settlements%22%20OR%20%22Impact%20of%20cities%22%20OR%20%22Inadequate%20housing%22%20OR%20%22Informal%20settlements%22%20OR%20infrastructure%20OR%20land%20OR%20%22Local%20materials%22%20OR%20%27mitigation%20OR%20%22Natural%20disasters%22%20OR%20over%20AND%20crowding%20OR%20pollution%20OR%20population%20OR%20%22Public%20spaces%22%20OR%20resilient%20OR%20%22Resource%20efficiency%22%20OR%20%22Resource%20needs%22%20OR%20%22Risk%20reduction%20strategy%22%20OR%20%22Road%20safety%22%20OR%20shanty%20OR%20slums%20OR%20suburban%20OR%20sustainable%20OR%20%22Sustainable%20building%2a%22%20OR%20%22Sustainable%20city%22%20OR%20%22Sustainable%20communities%22%20OR%20%22Sustainable%20urbanisation%22%20OR%20%22Town%20planning%22%20OR%20transport%20OR%20urban%20OR%20urbanisation%20OR%20waste%20OR%20water%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        12: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28capitalism%20OR%20cars%20OR%20%22Circular%20economy%22%20OR%20%22Commercial%20enterprises%22%20OR%20%22Consumer%20levels%22%20OR%20consumerism%20OR%20consumption%20OR%20%22Deep%20decarbonisation%22%20OR%20ecological%20OR%20%22Efficient%20use%20of%20resources%22%20OR%20energy%20OR%20food%20OR%20%22Fossil%20fuel%20subsidies%22%20OR%20%22Future%20proof%22%20OR%20%22Greenhouse%20gasses%22%20OR%20%22Harvest%20losses%22%20OR%20%22Life%20cycle%22%20OR%20%22Market%20distortions%22%20OR%20materialism%20OR%20%22Materials%20goods%22%20OR%20%22Monitoring%20sustainable%20development%22%20OR%20%22Natural%20resources%22%20OR%20%22Obsolescence%22%20OR%20%22Overconsumption%22%20OR%20production%20OR%20recycle%20OR%20recycling%20OR%20reduction%20OR%20renewable%20OR%20%22Resource%20efficiency%22%20OR%20%22Responsible%20production%20chains%22%20OR%20retail%20OR%20reuse%20OR%20sustainable%20OR%20vehicles%20OR%20waste%20OR%20water%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        13: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28carbon%20OR%20%22Changing%20weather%20patterns%22%20OR%20climate%20OR%20%22CO2%20capture%22%20OR%20%22CO2%20conversion%22%20OR%20%22COP%2021%22%20OR%20%22COP%2022%22%20OR%20ecosystems%20OR%20emissions%20OR%20%22Extreme%20weather%22%20OR%20%22Greenhouse%20gas%22%20OR%20%22Greenhouse%20gases%22%20OR%20%22Ice%20loss%22%20OR%20%22Low-carbon%20economy%22%20OR%20%22Natural%20disasters%22%20OR%20%22Natural%20systems%22%20OR%20%22Paris%20Agreement%22%20OR%20pollution%20OR%20renewable%20OR%20%22Sea%20level%20rise%22%20OR%20%22Rising%20sea%22%20OR%20temperature%20OR%20warming%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        14: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28biodiversity%20OR%20%22Carbon%20dioxide%22%20OR%20%22Coastal%20biodiversity%22%20OR%20%22Coastal%20ecosystems%22%20OR%20%22Coastal%20habitats%22%20OR%20%22Coastal%20parks%22%20OR%20%22Coastal%20resources%22%20OR%20coastlines%20OR%20conserve%20OR%20%22Coral%20bleaching%22%20OR%20%22Coral%20reef%22%20OR%20%22Ecosystem%20management%22%20OR%20%22Fish%20species%22%20OR%20%22Fish%20stocks%22%20OR%20fisheries%20OR%20fishers%20OR%20fishing%20OR%20%22Global%20warming%22%20OR%20%22Illegal%20fishing%22%20OR%20kelp%20OR%20%22Law%20of%20the%20Sea%22%20OR%20marine%20OR%20ocean%20OR%20oceanography%20OR%20oceans%20OR%20overfishing%20OR%20%22Protected%20areas%22%20OR%20%22Sea%20grasses%22%20OR%20seas%20OR%20%22Sustainable%20ecosystems%22%20OR%20%E2%80%9CWater%20resources%20and%20policy%E2%80%9D%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        15: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28afforestation%20OR%20agriculture%20OR%20animals%20OR%20%22Arable%20land%22%20OR%20bees%20OR%20biodiversity%20OR%20conservation%20OR%20deforestation%20OR%20desertification%20OR%20drought%20OR%20drylands%20OR%20ecosystem%20OR%20ecosystems%20OR%20extinct%20OR%20extinction%20OR%20forest%20OR%20forests%20OR%20%22Genetic%20resources%22%20OR%20%22Illegal%20wildlife%20products%22%20OR%20%22Illicit%20trafficking%22%20OR%20indigenous%20OR%20%22Invasive%20alien%20species%22%20OR%20%22Land%20conservation%22%20OR%20%22Land%20degradation%22%20OR%20%22Land%20loss%22%20OR%20%22Land%20use%20and%20sustainability%22%20OR%20%22Manage%20forests%22%20OR%20%22Managed%20forests%22%20OR%20%22Micro-organisms%22%20OR%20permaculture%20OR%20plants%20OR%20poaching%20OR%20poverty%20OR%20%22Protected%20fauna%22%20OR%20%22Protected%20flora%22%20OR%20%22Protected%20species%22%20OR%20reforestation%20OR%20soil%20OR%20species%20OR%20tree%20OR%20wetlands%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        16: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28abuse%20OR%20accountability%20OR%20%22Accountable%20institutions%22%20OR%20%22Arbitrary%20detention%22%20OR%20arms%20OR%20%22Birth%20registration%22%20OR%20bribery%20OR%20%22Combat%20terrorism%22%20OR%20%22Conflict%20resolution%22%20OR%20conflicts%20OR%20corruption%20OR%20discrimination%20OR%20education%20OR%20enforced%20AND%20disappearance%20OR%20%22Equal%20access%22%20OR%20equity%20OR%20exploitation%20OR%20%22Flow%20of%20arms%22%20OR%20freedom%20OR%20%22Geography%20of%20poverty%22%20OR%20governance%20OR%20%22Hate%20crime%22%20OR%20%22Human%20rights%22%20OR%20%22Illegal%20arms%22%20OR%20%22Illicit%20financial%20flows%22%20OR%20inclusion%20OR%20%22Inclusive%20institutions%22%20OR%20%22Inclusive%20societies%22%20OR%20%22inclusive%20society%22%20OR%20institutions%20OR%20%22Internally%20displaced%22%20OR%20judiciary%20OR%20justice%20OR%20%22Legal%20identity%22%20OR%20%22National%20Security%22%20OR%20%22Non-violence%22%20OR%20%22Organized%20crime%22%20OR%20%22Paris%20principles%22%20OR%20peace%20OR%20%22Peaceful%20societies%22%20OR%20%22Physical%20abuse%22%20OR%20police%20OR%20%22Public%20policy%22%20OR%20%22Quality%20of%20life%22%20OR%20%22Representative%20decision-making%22%20OR%20%22Rule%20of%20law%22%20OR%20%22Security%20threats%22%20OR%20%22Stolen%20assets%22%20OR%20%22Tax%20evasion%22%20OR%20theft%20OR%20torture%20OR%20trafficking%20OR%20transparency%20OR%20%22Un-sentenced%20detainees%22%20OR%20%22Unstable%20societies%22%20OR%20violence%20OR%20%22Weapon%20seizures%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%29&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}`,
        17: (cursorMark = "*") => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%28%28%22COVID-19%22%20OR%20%22SARS-CoV-2%22%20OR%20%22COVID19%22%20OR%20%22COVID%22%29%20AND%20%28%22Capacity%20building%22%20OR%20%22Civil%20society%20partnerships%22%20OR%20%22Communication%20technologies%22%20OR%20%22Debt%20sustainability%22%20OR%20%22Development%20assistance%22%20OR%20%22Disaggregated%20data%22%20OR%20%22Doha%20Development%20Agenda%22%20OR%20entrepreneurship%20OR%20%22Environmentally%20sound%20technologies%22%20OR%20%22Foreign%20direct%20investments%22%20OR%20%22Fostering%20innovation%22%20OR%20%22Free%20trade%22%20OR%20%22Fundamental%20principles%20of%20official%20statistics%22%20OR%20%22Global%20partnership%22%20OR%20%22Global%20stability%22%20OR%20%22International%20aid%22%20OR%20%22International%20cooperation%22%20OR%20%22International%20population%20and%20housing%20census%22%20OR%20%22International%20support%22%20OR%20%22Knowledge%20sharing%22%20OR%20%22Multi-stakeholder%20partnerships%22%20OR%20%22Poverty%20eradication%22%20OR%20%22Public-private%20partnerships%22%20OR%20%22Science%20cooperation%20agreements%22%20OR%20%22Technology%20cooperation%20agreements%22%20OR%20%22Technology%20transfer%22%20OR%20%22Weighted%20tariff%20average%22%20OR%20%22Women%20entrepreneurs%22%20OR%20%22World%20Trade%20Organization%22%29%20AND%20%28FIRST_PDATE%3A%5B2020-01-10%20TO%20${new Date().toISOString().replace(/T.*/,'').split('-').join('-')}%5D%29%2&format=json&resultType=core&pageSize=${pageSize}&cursorMark=${cursorMark}9`
    }

    let payload = await (await fetch(queries[query](nextCursor))).json();
    return payload;
}

myConnector.getData = async function(table, doneCallback) {
    const query = parseInt(tableau.connectionData);
    const allData = await getAllPages(query);

    table.appendRows(allData);
    doneCallback();
};

tableau.registerConnector(myConnector);

var connectionData;

$("#submit-btn").click(function() {
    tableau.connectionName = "Covid Data";
    tableau.connectionData = connectionData;
    tableau.submit();
});

for (let i = 1; i < 18; i++) {
    const id = "sdg-" + i;

    document.getElementById(id).addEventListener("click", () => {
        console.log('connectionData is', i);
        connectionData = i.toString();

        Array.prototype.forEach.call(document.getElementsByClassName("query-button"), element => {
            if (element.classList.contains("btn-warning")) {
                element.classList.remove("btn-warning");
                element.classList.add("btn-primary");
            }
        });

        document.getElementById(id).classList.remove("btn-primary");
        document.getElementById(id).classList.add("btn-warning");
    });
}

