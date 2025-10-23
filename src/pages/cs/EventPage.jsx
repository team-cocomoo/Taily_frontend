import React from "react";

import animal1 from "@/assets/image/반려동물1.png";
import animal2 from "@/assets/image/반려동물2.png";
import animal3 from "@/assets/image/반려동물3.png";

function EventPage() {
  const eventImages = [animal1, animal2, animal3];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>이벤트 포스터</h1>
      <div style={styles.grid}>
        {eventImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`이벤트 포스터 ${i + 1}`}
            style={styles.image}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  image: {
    width: "280px",
    borderRadius: "12px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
  },
};

export default EventPage;
