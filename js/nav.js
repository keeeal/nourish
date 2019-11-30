
// NavBar class
// props: can_export, onImport, onExport
function NavBar(props) {
  return ReactDOM.createPortal(
    <nav className="mdl-navigation">
      <a className="mdl-navigation__link" href="">
        <i className="material-icons-round">menu</i>
      </a>
      <a className="mdl-navigation__link" href="" onClick={props.onImport}>
        <i className="material-icons-round">cloud_upload</i>
      </a>
      <a className={"mdl-navigation__link" + (props.can_export ? "" : " disabled")} href="" onClick={props.onExport}>
        <i className="material-icons-round">save</i>
      </a>
    </nav>,
    document.getElementById('nav-row')
  );
}
