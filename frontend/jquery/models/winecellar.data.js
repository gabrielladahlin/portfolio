var uiModels = uiModels || {};
uiModels.winecellar_data = [
    {
        name: "Macrostie",
        label_img: "wine/macrostie.gif",
        vintage: 2008,
        winery: "Mc Williams",
        bsize: 1,
        type: 1,
        price: 20,
        grape: 1,
        country: 18,
        region: "Sonoma",
        buying_date: "2008-05-12",
        value: 24,
        purchased: 24,
        remaining: 16,
        drink_from: 2009,
        drink_to: 2020,
        peak_from: 2014,
        peak_to: 2017,
        degustations: [
            {
                "ddate": "2008-05-08",
                "robe": "light",
                "nose": "fruity",
                "taste": "fruity",
                "notes": "too young"
            },
            {
                "ddate": "2011-03-10",
                "robe": "light",
                "nose": "light fruit",
                "taste": "",
                "notes": ""
            },
            {
                "ddate": "2012-12-12",
                "robe": "light",
                "nose": "light fruit",
                "taste": "",
                "notes": "Great"
            }
        ]
    },
    {
        name: "Château d'Yquem",
        label_img: 'wine/yquem.gif',
        vintage: 2012,
        winery:'Lur Saluces',
        bsize: 1,
        type: 2,
        grape: 59,
        buying_date: "2012-12-12",
        price: 399,
        value: 460,
        drink_from: 2012,
        drink_to: 2017,
        purchased: 3,
        remaining: 1,
        country: 7,
        region: "Bordeaux",
        area:'Sauternes and Barsac',
        score_parker: 92,
        score_winespectator: 94,
        degustations: [
            {
                ddate: '2013-04-23',
                robe: 'golden',
                nose: 'fruity',
                taste: 'incredible'
            },
            {
                ddate: '2013-05-12',
                robe: 'clear',
                nose: 'strong and sweet',
                taste: 'outstanding'
            }
        ]
    },
    {
        name: 'Château St Jean',
        label_img: 'wine/stjean.gif',
        vintage: 2008,
        winery:'Ch St Jean',
        bsize: 1,
        type: 1,
        price: 34,
        value: 32,
        purchased: 12,
        remaining: 5,
        drink_from: 2009,
        grape: 'shiraz',
        country: 7,
        score_parker: 68,
        score_winespectator: 72,
        degustations: [
            {
                ddate: '2013-24-12',
                robe: 'thick',
                nose: 'strong',
                taste: 'good',
                notes:'Great w/ beef.'
            }
        ]
    },
    {
        name: 'Vine Cliff',
        label_img: 'wine/vinecliff.gif',
        vintage: 2013,
        winery:'Vine Cliff',
        bsize: 1,
        type: 1,
        buying_date: "2013-05-05",
        price: 28,
        drink_from: 2014,
        grape: 3,
        country: 18,
        score_parker: 67,
        score_winespectator: 62,
        degustations: [
            {
                ddate: '2013-05-05',
                robe: 'light',
                nose: 'strong',
                taste: 'good'
            },
            {
                ddate: '2013-08-05',
                robe: 'light',
                nose: 'strong',
                taste: 'good'
            },
            {
                ddate: '2013-08-18',
                robe: 'light',
                nose: 'strong',
                taste: 'ok'
            }
        ]
    },
    {
        name: 'Château Montelena',
        label_img: 'wine/montelena.gif',
        vintage: 2005,
        winery:'Château Montelena',
        bsize: 4,
        grape: 3,
        type: 1,
        drink_from: 2005,
        region:'California',
        price: 62,
        value: 32,
        purchased: 12,
        remaining: 8,
        country: 18,
        score_parker: 64,
        score_winespectator: 64,
        degustations: [
            {
                ddate: '2012-05-05',
                nose: 'strong+',
                taste: 'excellent'
            },
            {
                ddate: '2013-10-22',
                robe: 'rich',
                nose: 'strong',
                taste: 'very good'
            }
        ]
    }
];

if(typeof module === "object" && typeof module.exports === "object"){
    module.exports = uiModels.winecellar_data;
}

