
// sum an attribute of a masked list objects
function sum(objs, mask, attr) {
  var sum = 0
  for (var i = 0; i < Math.min(objs.length, mask.length); i++) {
    if (mask[i] && objs[i].hasOwnProperty(attr)) {
      sum += objs[i][attr]
    }
  }
  return sum
}

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

// Board class
// props: none
class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_card: {
        name: null,
        energy: null,
        protein: null,
        carbs: null,
        sugar: null,
        fats: null,
        fibre: null,
      },
      limits: {
        energy: 10,
        carbs: 10,
      },
      goals: {},
      cards: [],
      selected: [],
      disabled: [],
      show_form: false,
    }
  }

  importCards() {

  }

  // download all cards as a json file
  exportCards() {
    let cardsStr = JSON.stringify(this.state.cards)
    let cardsUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(cardsStr)
    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', cardsUri)
    linkElement.setAttribute('download', 'nourish_cards.json')
    linkElement.click()
  }

  // update disabled cards
  updateDisabled(cards, selected) {
    const disabled = Array(cards.length).fill(false)

    for (var attr in this.state.limits) {
      if (this.state.limits.hasOwnProperty(attr)) {
        var attr_selected = sum(cards, selected, attr)
        var attr_limit = this.state.limits[attr]

        for (var i = 0; i < disabled.length; i++) {
          if (! selected[i]) {
            if (cards[i][attr] + attr_selected > attr_limit) {
              disabled[i] = true
            }
          }
        }
      }
    }

    this.setState({disabled: disabled})
  }

  // called when card with position 'index' in state is clicked
  cardClicked(event, index) {
    // don't select if disabled
    if (this.state.disabled[index]) return

    // toggle card selected
    const selected = this.state.selected.slice()
    selected[index] = ! selected[index]

    this.updateDisabled(this.state.cards, selected)
    this.setState({selected: selected})
  }

  cardDeleted(event, index) {
    event.stopPropagation()

    const cards = this.state.cards.slice()
    const selected = this.state.selected.slice()
    cards.splice(index, 1)
    selected.splice(index, 1)

    this.setState({
      cards: cards,
      selected: selected,
    })
  }

  // called when the add button is clicked
  addButtonClicked(event) {
    this.setState({show_form: ! this.state.show_form})
  }

  // called when text in the add form is changed
  addFormChanged(event) {
    const new_card = Object.assign({}, this.state.new_card)

    // for empty strings store null
    if (event.target.value.length) {
      if (event.target.id == "name") {
        new_card[event.target.id] = event.target.value
      } else {
        new_card[event.target.id] = parseFloat(event.target.value)
      }
    } else {
      new_card[event.target.id] = null
    }

    this.setState({new_card: new_card})
  }

  // called when the add form is submitted
  addFormSubmitted(event) {
    event.preventDefault()

    // don't add a card if values are missing
    for (const value of Object.values(this.state.new_card)) {
      if (value == null) return
    }

    // add new card to cards
    const cards = this.state.cards.slice()
    cards.push(this.state.new_card)
    this.updateDisabled(cards, this.state.selected)
    this.setState({
      cards: cards,
      show_form: ! this.state.show_form,
    })
    $(event.target).trigger("reset")
  }

  // render the i'th card
  renderCard(index) {
    return <Card
      key={index}
      card={this.state.cards[index]}
      selected={this.state.selected[index]}
      disabled={this.state.disabled[index]}
      onClick={e => this.cardClicked(e, index)}
      onDelete={e => this.cardDeleted(e, index)}
    />
  }

  // render the add button
  renderAddButton() {
    return <AddButton
      tooltip={! this.state.show_form}
      onClick={e => this.addButtonClicked(e)}
    />
  }

  // render the add form
  renderAddForm() {
    return <AddForm
      show={this.state.show_form}
      new_card={this.state.new_card}
      onChange={e => this.addFormChanged(e)}
      onSubmit={e => this.addFormSubmitted(e)}
    />
  }

  // render the board
  render() {
    var rendered_cards = []
    for (var i = 0; i < this.state.cards.length; i++) {
        rendered_cards.push(this.renderCard(i))
    }
    return (
      <div>
        {rendered_cards}
        {this.renderAddButton()}
        {this.renderAddForm()}
      </div>
    )
  }
}

// main
ReactDOM.render(
  <Board />,
  document.getElementById("board")
)
