import styles from './Form.module.css';

function Form({ value, onChange, onSubmit, isLoading, ref }) {
  return (
    <form onSubmit={onSubmit} className={styles.weatherForm}>
      <input 
        type="text"
        placeholder="Enter a city"
        value={value}
        onChange={onChange}
        className={styles.cityInput}
        ref={ref}
      />
      <button
        type='submit'
        className={styles.searchButton}
        disabled={isLoading}
      >
        Search
      </button>
    </form>
  )
}

export default Form