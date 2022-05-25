function make_done(card_element,e) {
    e.stopPropagation()
    card_element.classList.add("opacity-50")
    let but = card_element.querySelector(".btn")
    but.classList.remove("btn-danger")
    but.classList.add("btn-success")
    let text = card_element.querySelector(".card-title")
    text.classList.add("text-decoration-line-through")
    let contents = card_element.querySelector(".card-text")
    contents.classList.add("text-decoration-line-through")
    let img = card_element.querySelector(".card-img-top")
    img.classList.add("opacity-50")
    but.setAttribute("onclick","make_undone(this.parentElement.parentElement,event)")
    but.textContent = "Не сделано"
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card_element.getAttribute("data-cardid")
    $.post({
        url: "/toggle",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
}

function make_undone(card_element,e) {
    e.stopPropagation();
    card_element.classList.remove("opacity-50")
    let but = card_element.querySelector(".btn")
    but.classList.remove("btn-success")
    but.classList.add("btn-danger")
    let text = card_element.querySelector(".card-title")
    text.classList.remove("text-decoration-line-through")
    let contents = card_element.querySelector(".card-text")
    contents.classList.remove("text-decoration-line-through")
    let img = card_element.querySelector(".card-img-top")
    img.classList.remove("opacity-50")
    but.setAttribute("onclick","make_done(this.parentElement.parentElement,event)")
    but.textContent = "Сделано"
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card_element.getAttribute("data-cardid")
    $.post({
        url: "/toggle",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
}

function make_done_detail(card_element,e) {
    let but = card_element.querySelector(".btn")
    but.classList.remove("btn-danger")
    but.classList.add("btn-success")
    but.setAttribute("onclick","make_undone_detail(this.parentElement.parentElement,event)")
    but.textContent = "Не сделано"
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card_element.getAttribute("data-cardid")
    $.post({
        url: "/toggle",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
}

function make_undone_detail(card_element,e) {
    let but = card_element.querySelector(".btn")
    but.classList.add("btn-danger")
    but.classList.remove("btn-success")
    but.setAttribute("onclick","make_done_detail(this.parentElement.parentElement,event)")
    but.textContent = "Сделано"
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card_element.getAttribute("data-cardid")
    $.post({
        url: "/toggle",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
}

const remove_card = (card,e) => {
    e.stopPropagation();
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card.getAttribute("data-cardid")
    $.post({
        url: "/delete",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    card.parentElement.removeChild(card)
}

const remove_card_detail = (card,e) => {
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card.getAttribute("data-cardid")
    $.post({
        url: "/delete",
        data: {'card_id':card_id},
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: a => window.location.href = '/'
    })
}