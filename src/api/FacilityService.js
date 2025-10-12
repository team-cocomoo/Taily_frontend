const API_KEY = "45fb1056-d014-4392-83d1-416e4feba199";

// XML → JSON 변환 함수
function xmlToJson(xml) {
  if (xml.nodeType === 3) return xml.nodeValue.trim();
  const obj = {};
  if (xml.attributes && xml.attributes.length > 0) {
    obj["@attributes"] = {};
    for (let i = 0; i < xml.attributes.length; i++) {
      const attr = xml.attributes.item(i);
      obj["@attributes"][attr.nodeName] = attr.nodeValue;
    }
  }
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      const content = xmlToJson(item);
      if (content === "") continue;
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = content;
      } else {
        if (typeof obj[nodeName].push === "undefined") {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(content);
      }
    }
  }
  return obj;
}

export async function getFacilityData() {
  const url = `https://api.kcisa.kr/openapi/service/rest/convergence2019/getConver03?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&keyword=동물병원&where=서울`;
  const response = await fetch(url);
  const text = await response.text();

  const parser = new DOMParser();
  const XML = parser.parseFromString(text, "text/xml");
  const json = xmlToJson(XML);
  console.log("data", json);

  const items = json?.response?.body?.items?.item;
  return Array.isArray(items) ? items : [items];
}


