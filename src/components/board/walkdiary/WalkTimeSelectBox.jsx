import React from "react";
import Select from "react-select";

const WalkTimeSelectBox = ({ item, value, onChange, parentStartTime }) => {
    // 30분 단위 시간 배열 생성 (00:00 ~ 23:30)
    const timeArray = Array.from({ length: 24 * 2 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour}:${minute}`;
    });

    // 시간 select box 커스텀
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: "10px",
            borderColor: state.isFocused ? "#FEBA17" : "#ccc",
            boxShadow: state.isFocused ? "0 0 5px #FEBA17" : "none",
            "&:hover": {
                borderColor: "#FEBA17",
            },
            width: "16rem", // 너비 추가
            height: "3rem", // 높이 추가
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#999",
            fontStyle: "italic",
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#FEBA17",
        }),
        menu: (provided) => ({
            ...provided,
            width: "16rem",
            fontWeight: "500",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "rgba(254, 186, 23, 0.5)"   // 마우스 오버 색
                : state.isFocused
                ? "rgba(254, 186, 23, 0.5)"  // 선택된 색
                : "white",       // 기본 색
            color: state.isSelected ? "white" : "black", // 선택 시 글자 색
            fontWeight: state.isSelected ? "600" : "400",
            cursor: "pointer",
            ":active": {
                backgroundColor: state.isSelected
                    ? "rgba(254, 186, 23, 0.5)"
                    : "#FEBA17",
            },
        }),
    };

    // react-select 옵션
    const timeOptions = timeArray.map((t) => ({ value: t, label: t }));

    // value와 onChange 연결
    // const selectedOption = timeOptions.find((opt) => opt.value === value) || null;

    return (
        <Select
            name={item.name}
            value={timeOptions.find((opt) => opt.value === value) || null}
            onChange={(opt) => onChange(opt?.value ?? "")}
            options={
                item.name === "endTime" && parentStartTime
                    ? timeOptions.filter((opt) => opt.value > parentStartTime)
                    : timeOptions
            }
            placeholder={item.defaultValue}
            styles={customStyles}
        />
    );
};

export default WalkTimeSelectBox;
