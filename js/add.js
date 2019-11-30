
// AddForm class
// props: show, new_card, onChange, onSubmit
function AddForm(props) {
  return (
    <div className={"form-card mdl-card mdl-shadow--2dp" + (props.show ? "" : " hidden")}>
      <form id="add-form" onSubmit={props.onSubmit}>

        {Object.keys(props.new_card).map(key => (
          <div key={key}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input className="mdl-textfield__input" type="text" id={key}
                pattern={key == "name" ? ".*" : "-?[0-9]*(\.[0-9]+)?"}
                onChange={props.onChange}>
              </input>
              <label className="mdl-textfield__label" htmlFor={key}>{key}...</label>
              <span className="mdl-textfield__error">Input is not a number!</span>
            </div>
          </div>
        ))}

        <input type="submit" style={{position: "absolute", left: "-9999px"}}/>
      </form>
    </div>
  )
}

// AddButton class
// props: tooltip, onClick
function AddButton(props) {
  return (
    <div>
      <button
        id="add-button"
        className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"
        onClick={props.onClick}>

        <i className="material-icons">add</i>
      </button>
      <div
        className={"mdl-tooltip mdl-tooltip--top" +
          (props.tooltip ? "" : " hidden")}
        htmlFor="add-button">
        New card
      </div>
    </div>
  )
}
