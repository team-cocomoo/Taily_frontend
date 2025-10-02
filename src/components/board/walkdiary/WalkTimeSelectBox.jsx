import React from "react";
import Select from "react-select";

const WalkTimeSelectBox = ({ item, times, setTimes }) => {
    // 30분 단위 시간 배열 생성 (00:00 ~ 23:30)
    const timeArray = Array.from({ length: 24 * 2 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour}:${minute}`;
    });

    // react-select 옵션
    const timeOptions = timeArray.map((t) => ({ value: t, label: t}));

    const updateTimeState = (name, value) =>
        setTimes((prev) => ({ ...prev, [name]: value }));

    return (
        <Select
            name={item.name}
            value={timeOptions.find((opt) => opt.value === times[item.name])}
            onChange={(opt) => updateTimeState(item.name, opt?.value ?? "")}
            options={timeOptions.filter((opt) =>
                item.name === "endTime" ? opt.value > times.startTime : true
            )}
            placeholder={item.defaultValue}
            styles={{
                control: (provided) => ({ ...provided, width: "16rem", height: "3rem" }),
                menu: (provided) => ({ ...provided, width: "16rem", fontWeight: "500" }),
            }}
        />
    );
};

export default WalkTimeSelectBox;
