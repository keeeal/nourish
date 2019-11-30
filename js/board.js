
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

  // import cards from a json file
  importCards(event) {
    event.preventDefault()
    console.log("import")
  }

  // download all cards as a json file
  exportCards(event) {
    event.preventDefault()

    // don't download if there are no cards
    if (this.state.cards.length == 0) return

    // download
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

  // click the card with position 'index' in state.cards
  cardClicked(event, index) {
    // don't select if disabled
    if (this.state.disabled[index]) return

    // toggle card selected
    const selected = this.state.selected.slice()
    selected[index] = ! selected[index]

    this.updateDisabled(this.state.cards, selected)
    this.setState({selected: selected})
  }

  // delete the card with position 'index' in state.cards
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

  // render nav bar
  renderNavBar() {
    return <NavBar
      can_export={this.state.cards.length > 0}
      onExport={e => this.exportCards(e)}
      onImport={e => this.importCards(e)}
    />
  }

  // render the card with position 'index' in state.cards
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
      <div id="board">
        {rendered_cards}
        {this.renderNavBar()}
        {this.renderAddButton()}
        {this.renderAddForm()}
      </div>
    )
  }
}

// main
ReactDOM.render(
  <Board />,
  document.getElementsByTagName("main")[0]
)