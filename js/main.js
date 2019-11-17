
function sum(objs, mask, attr) {
  var sum = 0
  for (var i = 0; i < Math.min(objs.length, mask.length); i++) {
    if (mask[i] && objs[i].hasOwnProperty(attr)) {
      sum += objs[i][attr]
    }
  }
  return sum
}

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.reference = React.createRef()
  }

  render() {
    return (
      <div
        ref={this.reference}
        className={"card mdl-card mdl-shadow--2dp" +
          (this.props.selected ? " selected" : "") +
          (this.props.disabled ? " disabled" : "")}
        onClick={this.props.onClick}>

        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{this.props.name}</h2>
        </div>
        <div className="mdl-card__menu">
          <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i className="material-icons">edit</i>
          </button>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // random rotation
    $(this.reference.current).css({
      transform: "rotate(" + (30*Math.random() - 15) + "deg)",
    })

    // make draggable
    $(this.reference.current).draggable({
      containment: "#board",
      scroll: false,
      stack: ".card",
    })
  }
}

function AddButton(props) {
  return (
    <div>
      <button
        id="add-button"
        className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"
        onClick={props.onClick}>

        <i className="material-icons">add</i>
      </button>
      <div className="mdl-tooltip mdl-tooltip--top" htmlFor="add-button">
        New card
      </div>
    </div>
  )
}

function AddForm(props) {
  return (
    <div className={"form-card mdl-card mdl-shadow--2dp"}>
      <form id="add-form" action="#">
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" type="text" id="name"></input>
          <label className="mdl-textfield__label" htmlFor="name">Card name...</label>
        </div>
        <br></br>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="energy"></input>
          <label className="mdl-textfield__label" htmlFor="energy">Energy...</label>
          <span className="mdl-textfield__error">Input is not a number!</span>
        </div>
      </form>
    </div>

  )
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      limits: {
        energy: 10,
      },
      goals: {
        energy: 6,
      },
      cards: [
        // {
        //   name: "Anchovies",
        //   energy: 4,
        // },
        // {
        //   name: "Brocolli",
        //   energy: 5,
        // },
        // {
        //   name: "Cake",
        //   energy: 7,
        // },
      ],
      selected: [],
      disabled: [],
      show_form: false,
    }

    let n_cards = this.state.cards.length
    this.state.selected = Array(n_cards).fill(false)
    this.state.disabled = Array(n_cards).fill(false)
  }

  cardClicked(index) {
    // don't select if disabled
    if (this.state.disabled[index]) return

    // toggle card selected
    const selected = this.state.selected.slice()
    selected[index] = ! selected[index]

    // update disabled cards
    const disabled = Array(this.state.cards.length).fill(false)

    for (var attr in this.state.limits) {
      if (this.state.limits.hasOwnProperty(attr)) {
        var attr_selected = sum(this.state.cards, selected, attr)
        var attr_limit = this.state.limits[attr]

        for (var i = 0; i < disabled.length; i++) {
          if (! selected[i]) {
            if (this.state.cards[i][attr] + attr_selected > attr_limit) {
              disabled[i] = true
            }
          }
        }
      }
    }

    this.setState({
      selected: selected,
      disabled: disabled,
    })
  }

  addButtonClicked() {
    this.setState({
      show_form: ! this.state.show_form,
    })
  }

  renderCard(index) {
    return <Card
      key={index}
      selected={this.state.selected[index]}
      disabled={this.state.disabled[index]}
      name={this.state.cards[index].name}
      energy={this.state.cards[index].energy}
      onClick={() => this.cardClicked(index)}
    />
  }

  renderAddButton() {
    return <AddButton onClick={() => this.addButtonClicked()}/>
  }

  renderAddForm() {
    return <AddForm />
  }

  render() {
    var rendered_cards = []
    for (var i = 0; i < this.state.cards.length; i++) {
        rendered_cards.push(this.renderCard(i))
    }
    return (
      <div>
        {rendered_cards}
        {this.renderAddButton()}
        {this.state.show_form && this.renderAddForm()}
      </div>
    )
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById("board")
)
