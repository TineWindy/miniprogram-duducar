var districts = [{
  "name": "文理学部",
  "id": "100"
}, {
  "name": "工学部",
  "id": "200"
}, {
  "name": "信息学部",
  "id": "300"
}, {
  "name": "医学部",
  "id": "400"
}]

var locations = {
  "100": [{
      "districts": "文理学部",
      "name": "总图",
      "id": "101"
    },
    {
      "districts": "文理学部",
      "name": "奥场",
      "id": "102"
    },
    {
      "districts": "文理学部",
      "name": "梅园小操场",
      "id": "103"
    }
  ],
  "200": [{
      "districts": "工学部",
      "name": "工学部操场",
      "id": "201"
    },
    {
      "districts": "工学部",
      "name": "工学部菜市场",
      "id": "202"
    }
  ],
  "300": [{
      "districts": "信息学部",
      "name": "信息学部图书馆",
      "id": "301"
    },
    {
      "districts": "信息学部",
      "name": "信息学部操场",
      "id": "302"
    }
  ],
  "400": [{
    "districts": "医学部",
    "name": "医学部操场",
    "id": "401"
  }]
}


module.exports = {
  districts,
  locations,
}