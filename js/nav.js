
// NavMenu class
// props: show, limits, goals, totals
function NavMenu(props) {
  return ReactDOM.createPortal(
    <div className={"menu" + (props.show ? "" : " hidden")}>

    </div>,
    document.getElementById('menu')
  )
}

// NavBar class
// props: can_export, onMenu, onImport, onExport, onComplete
function NavBar(props) {
  return ReactDOM.createPortal(
    <nav className="mdl-navigation">
      <a className="mdl-navigation__link" href="" onClick={props.onMenu}>
        <i className="material-icons-round">menu</i>
      </a>
      <a className="mdl-navigation__link" href="" onClick={props.onImport}>
        <i className="material-icons-round">cloud_upload</i>
      </a>
      <a className={"mdl-navigation__link" + (props.can_export ? "" : " disabled")}
          href="" onClick={props.onExport}>
        <i className="material-icons-round">save</i>
      </a>
      <a className="mdl-navigation__link" href="" onClick={props.onComplete}>
        <i className="material-icons-round">shuffle</i>
      </a>
    </nav>,
    document.getElementById('nav-row')
  )
}
