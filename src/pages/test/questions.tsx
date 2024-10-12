
export default function Questions() {

  return (
    <>
      <div>
        <input
          className="form-check-input"
          type="radio"
          name="radioNoLabel"
          id="radioNoLabel1"
          value=""
          aria-label="..."
        />
      </div>

      <div>
        <input
          className="form-check-input"
          type="radio"
          name="radioNoLabel"
          id="radioNoLabel2"
          value=""
          aria-label="..."
          defaultChecked
        />
      </div>
    </>
  );
}
