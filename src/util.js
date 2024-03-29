export const PAGINATION_ELEMENTS_DEFAULT = 100;


export const generateLinePagination = (pagination) => {
    pagination *= PAGINATION_ELEMENTS_DEFAULT;
    var filterLine = '';
    if (pagination !== undefined) {

        filterLine = '?$skip=' + pagination + '&$take=' + (PAGINATION_ELEMENTS_DEFAULT);

    }
    return filterLine
}
export const generateLineFilter = (filter) => {
    var filterLine = "&$filter=(source%20ne%20'blip.ai'%20or%20source%20eq%20null)%20";
    if (typeof filter !== 'undefined' && Object.keys(filter).length !== 0) {
        if (filter.condition === 'startswith') {
            filterLine += 'and%20(' + filter.condition + '(' + filter.prop + "%2C'" + filter.value.split(' ').join('%20') + "'))"
        }
        else
         if (filter.condition === 'substringof' || filter.condition === 'not%20substringof' )
            filterLine += "and%20(" + filter.condition + "('" + filter.value.split(" ").join("%20") + "'%2C" + filter.prop + "))";
        else if (filter.condition === 'range') {
            filterLine += `and%20(lastmessagedate%20ge%20datetimeoffset'${encodeURIComponent(filter.value.inicial + ":")}00.000Z')%20%20and%20(lastmessagedate%20le%20datetimeoffset'${encodeURIComponent(filter.value.final + ":")}00.000Z')%20`
        }
        else
            filterLine += "and%20(" + filter.prop + "%20" + filter.condition + "%20'" + filter.value.split(" ").join("%20") + "')";

    }
    return filterLine
}
export const countIndex = (pagination) => {
    if (pagination < PAGINATION_ELEMENTS_DEFAULT)
        return 0;
    else if (pagination % PAGINATION_ELEMENTS_DEFAULT === 0)
        return (pagination / PAGINATION_ELEMENTS_DEFAULT);
    else
        return (~~(pagination / PAGINATION_ELEMENTS_DEFAULT) + 1);
}
export const formatArrayToJson = (data, pagination) => {

    if (data !== undefined) {
        let items = [];
        data.forEach((e, i) => {
            items.push(pagination === undefined ?
                { num: i + 1, name: e }
                : { num: (pagination * PAGINATION_ELEMENTS_DEFAULT) + i + 1, name: e })
        });

        return items
    }
    return [];
}
export const sortData = (data, sort) => {
    if (data !== undefined & data.length > 1) {
        data.sort(
            sort.order === 'asc' ?
                (a, b) => (a[sort.property] > b[sort.property]) ? 1 : ((b[sort.property] > a[sort.property]) ? -1 : 0) :
                (a, b) => (a[sort.property] < b[sort.property]) ? 1 : ((b[sort.property] < a[sort.property]) ? -1 : 0))
    }
    return data;
}

export const buildModel = (header) => {
    return [
        { label: "Identity", key: "identity" },
        { label: "Name", key: "name" },
        { label: "Source", key: "source" },
    ];
}


export const buildData = (header, data) => {
    let items = [];

    data.forEach(e => {
        let aux = {};
        for (let index = 0; index < header.length; index++) {
            try {
                if (header[index] === "extras" & e.data[index] !== "") {
                    Object.assign(aux, {
                        ...aux,
                        [header[index]]: JSON.parse(
                            e.data[index]
                                .split("&")
                                .join(",")
                                .split("'")
                                .join('"')
                        )
                    });
                }
                else if (e.data[index] !== "")
                    Object.assign(aux, { ...aux, [header[index]]: e.data[index] });
            } catch (error) {

            }

        }
        if (Object.keys(aux).length !== 0) items.push(aux);
    });
    return items;
}

export const removeEmptyFields = (data) => {
    let items = {};
    for (const key in data) {
        if (data[key] !== "") {
            items = { ...items, [key]: data[key] };
        }
    }
    return items;
}

export const replaceDelimiter = (data) => {
    let items = [];
    for (const item of data) {
        if (
            typeof item["extras"] !== "undefined" &&
            Object.keys(item["extras"]).length > 0
        )
            items.push({
                ...item,
                extras: JSON.stringify(item["extras"])
                    .split(",")
                    .join("&")
                    .split('\"')
                    .join("'")
            });
        else items.push(item);
    }
    return items;
}
export const formatToSendNotification = (data) => {
    let items = [];
    for (const item of data) {
        const number = `+${item.identity.split("@")[0]}`
        items.push({ "phone": number, "name": item.name })
    }
    return items;
}
