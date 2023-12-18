const ociConfig = {
    "totalCost": [
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": null },
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": "" },
        { "type": "filter", "field": "ProductCode", "operator": "neq", "value": null },
        { "type": "sum", "field": "TotalCost" }
    ],
    "services": [
        {
            "serviceId": "Virtual Machines",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Compute" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(OCPU Hours)" },
                { "type": "filter", "field": "ServiceId", "operator": "nct", "value": "Windows OS" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "Block Storage",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Block Storage" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(GB Months)" },
                { "type": "filter", "field": "ServiceId", "operator": "nct", "value": "Performance Units" }
            ], "reference": 5120, "increment": 10
        }, {
            "serviceId": "Load Balancers",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Load Balancer" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Load Balancer Hours)" }

            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "WAF",
            "group": "security",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Oracle Web Application Firewall" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Instance per Month)" }

            ], "reference": 1, "increment": 10
        }, {
            "serviceId": "Fast Connect",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Virtual Private Network" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "FastConnect" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Port Hours)" }

            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "OCVS",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "VMware" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "Oracle Cloud VMware Solution" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(OCPU Per Hour)" }

            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "Container Image Storage",
            "group": "container",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Compute / Container Image Storage" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(GB Months)" }

            ], "reference": 100, "increment": 10
        }, {
            "serviceId": "API Gateway", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "API Gateway / API Calls" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(1M API Calls)" },
                {
                    "type": "function",
                    fn: data => data.map(item => {
                        item.Quantity = item.Quantity * 1000000
                        return item;
                    })
                }
            ], "reference": 10000000, "increment": 5
        }, {
            "serviceId": "Autonomous Database / MySQL Database",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(OCPU Hours)" },
                {
                    "type": "function", 
                    "fn": data => data.filter(it => it.ServiceId.toString().startsWith('Database / Oracle Autonomous') || it.ServiceId.toString().startsWith('MySQL / MySQL Database'))
                },
            ], "reference": 720, "increment": 5
        }, {
            "serviceId": "Functions",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Functions / Oracle Functions" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(requests)" },
            ], "reference": 100000000, "increment": 2
        }
    ],
    "vm": {
        "steps": [
            { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Compute" },
            { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(GB Hours)" },
            {
                "type": "function",
                fn:
                    data => {
                        data.forEach(item => {
                            item._description = item.Description;
                            item._calculatedQuantity = Math.ceil(item.Quantity / 720 / 16);
                            item._type = item.Description;
                            item._cpu = 2;
                            item._mem = 16;
                        });
                        return data;
                    }
            }
        ]
    },
    "rds": {}
}

module.exports = ociConfig;