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

const pick_time = (card,e) => {
    let but = card.querySelector(".btn-secondary")
    but.classList.remove("btn-secondary")
    but.classList.add("btn-primary")
    but.setAttribute("onclick","schedule(this.parentElement.parentElement,event)")
    let card_body = card.querySelector(".card-body")
    let curts = new Date()
    let due_to = card.getAttribute("data-dueto")
    if (due_to == "") {
        due_to = curts/1000
    }
    let ts = new Date(Number.parseInt(due_to)*1000)
    let time_selector = document.createElement("input")
    time_selector.type = "date"
    time_selector.value = new Date(ts.getTime() - ts.getTimezoneOffset() * 60000).toISOString().substring(0, 19)
    time_selector.classList.add("form-control")
    time_selector.min = new Date(curts.getTime() - curts.getTimezoneOffset() * 60000).toISOString().substring(0, 19)
    card_body.prepend(time_selector)
    let due_to_elem = card.querySelector(".card-text")
    card_body.removeChild(due_to_elem)
}

const schedule = (card,e) => {
    let csrftoken = $('meta[name="csrf-token"]').attr('content')
    let card_id = card.getAttribute("data-cardid")
    let but = card.querySelector(".btn-primary")
    but.classList.add("btn-secondary")
    but.classList.remove("btn-primary")
    but.setAttribute("onclick","pick_time(this.parentElement.parentElement,event)")
    let time_selector = document.querySelector(".form-control")
    let new_due_obj = new Date(time_selector.value)
    let new_due = new_due_obj.getTime() / 1000
    let due_to_text = document.createElement("p")
    due_to_text.classList.add("card-text", "text-muted")
    
    let card_body = card.querySelector(".card-body")
    card_body.removeChild(time_selector)
    card_body.prepend(due_to_text)
    $.post({
        url: "/schedule",
        data: {'card_id':card_id, 'time':new_due},
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: a => {
            due_to_text.textContent = `Сделать до: ${new_due_obj.getDate().toString().padStart(2, '0')}.${(new_due_obj.getMonth()+1).toString().padStart(2, '0')}.${new_due_obj.getFullYear()}`
            card.setAttribute("data-dueto",new_due)
        },
        error: a => {
            let due_to = card.getAttribute("data-dueto")
            if (due_to == "") {
                card_body.removeChild(due_to_text)
            }
            else {
                let ts = new Date(Number.parseInt(due_to)*1000)
                due_to_text.textContent = `Сделать до: ${ts.getDate().toString().padStart(2, '0')}.${(ts.getMonth()+1).toString().padStart(2, '0')}.${ts.getFullYear()}`
            }
        }
    })
}