import styles from "../styles/Map.module.css";

export default function Map({}) {
  return (
    <div className={styles.container}>
      <iframe src="https://share.garmin.com/ZRS7S" frameBorder="0"></iframe>
    </div>
  );
}
