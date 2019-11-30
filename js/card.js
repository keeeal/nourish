
// Card class
// props: key, card, selected, disabled, onClick, onDelete
class Card extends React.Component {
  constructor(props) {
    super(props)
    this.reference = React.createRef()
  }

  render() {
    return (
      <div
        className={"card mdl-card mdl-shadow--2dp" +
          (this.props.selected ? " selected" : "") +
          (this.props.disabled ? " disabled" : "")}
        onClick={this.props.onClick}
        ref={this.reference}>

        <div className="card-title mdl-card__title">
          <h2 className="card-title-text mdl-card__title-text">{this.props.card.name}</h2>
        </div>
        <div className="card-menu mdl-card__menu">
          <button
            className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"
            onClick={this.props.onDelete}>

            <i className="material-icons">clear</i>
          </button>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // apply random rotation
    $(this.reference.current).css({
      transform: "rotate(" + (30*Math.random() - 15) + "deg)",
    })

    // make card draggable
    $(this.reference.current).draggable({
      containment: "#board",
      scroll: false,
      stack: ".card",
    })
  }
}
