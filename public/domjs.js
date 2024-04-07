const button = document.querySelector('#sendBtn')
const form = document.querySelector('#form')
const pageNum = document.querySelector('#pageNum')
const pagesTotal = document.querySelector('#pagesTotal')
const countTotal = document.querySelector('#countTotal')

const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

let brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, perPage

pageNum.innerHTML = '1'
pageNum.style.display = 'none'

document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
        brand = document.querySelector('#brand').value
        yearOne = document.querySelector('#yearOne').value
        yearTwo = document.querySelector('#yearTwo').value
        distanceOne = document.querySelector('#distanceOne').value
        distanceTwo = document.querySelector('#distanceTwo').value
        fuel = document.querySelector('#fuel').value
        gearbox = document.querySelector('#gearbox').value
        type = document.querySelector('#type').value
        drive = document.querySelector('#drive').value
        perPage = document.querySelector('#perPage').value
    })
})

document.querySelector('#perPage').addEventListener('change', (e) => {
    perPage = e.target.value
})

prev.addEventListener('click', (e) => {
    e.preventDefault()
    if (parseInt(pageNum.innerHTML) > 1) {
        pageNum.innerHTML = `${parseInt(pageNum.innerHTML) - 1}`
        sendReq(brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, perPage)
    }
})

next.addEventListener('click', (e) => {
    e.preventDefault()
    pageNum.innerHTML = `${parseInt(pageNum.innerHTML) + 1}`
    sendReq(brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, perPage)
})

button.addEventListener('click', e => {
    e.preventDefault()
    sendReq(brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, perPage)
})

function sendReq(brand, yearOne, yearTwo, distanceOne, distanceTwo, fuel, gearbox, type, drive, perPage) {

    fetch("http://localhost:3306/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            'brand': brand,
            'yearOne': yearOne, 
            'yearTwo': yearTwo,
            'distanceOne': distanceOne,
            'distanceTwo': distanceTwo,
            'fuel': fuel,
            'gearbox': gearbox,
            'type': type,
            'drive': drive,
            'pageNum': pageNum.innerHTML,
            'itemsPerPage': perPage
        })}).then(response => {
            if (!response.ok) {
                throw new Error('network shit')
            }
            return response.json()
        })
        .then(data => {
            if (data.totalCount !== 0) {
                document.querySelector('#err').style.display = 'none'
                document.querySelector('.pagination').style.display = 'flex'
                document.querySelector('#paginationContainer').style.display = 'flex'
                displayResult(data)
            } else {
                document.querySelector('.autod').innerHTML = ''
                document.querySelector('#paginationContainer').style.display = 'none'
                document.querySelector('.pagination').style.display = 'none'
                document.querySelector('#err').style.display = 'block'
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            })
        })
        .catch(error => {
            console.error('unlucky:', error)
        })   
}

const displayResult = cars => {
    document.querySelector('.autod').innerHTML = ''
    document.body.style.height = 'auto'
    pageNum.style.display = 'block'
    pagesTotal.innerHTML = `/${cars.totalPages}`
    countTotal.innerHTML = `kokku ${cars.totalCount}`
    
    if (pageNum.innerHTML == '1') {
        prev.style.display = 'none'
    } else {
        prev.style.display = 'block'
    }
    if (cars.totalPages == parseInt(pageNum.innerHTML)) {
        next.style.display = 'none'
    } else {
        next.style.display = 'block'
    }

    let items = cars.items
    for (let x in items) {
        const container = document.createElement('div')
        container.setAttribute('class', 'autoinfo')

        const innerContainer = document.createElement('div')
        innerContainer.setAttribute('class', 'textInner')
        
        let image = document.createElement('div')
        let imgEl = document.createElement('img')
        imgEl.src = items[x].image
        imgEl.setAttribute('class', 'thumb')
        image.appendChild(imgEl)
        
        const year = document.createElement('span')
        year.setAttribute('class', 'year')
        year.innerHTML = items[x].year
        const mileage = document.createElement('span')
        mileage.setAttribute('class', 'mileage')
        mileage.innerHTML = items[x].distance + 'km'
        const fuel = document.createElement('span')
        fuel.setAttribute('class', 'fuel')
        fuel.innerHTML = items[x].fuel
        const transmission = document.createElement('span')
        transmission.setAttribute('class', 'transmission')
        transmission.innerHTML = items[x].gearbox
        const bodytype = document.createElement('span')
        bodytype.setAttribute('class', 'bodytype')
        bodytype.innerHTML = items[x].type
        const drive = document.createElement('span')
        drive.setAttribute('class', 'drive')
        drive.innerHTML = items[x].drive
        
        let extra = document.createElement('div')
        extra.setAttribute('class', 'extra')
        
        extra.appendChild(year)
        extra.appendChild(mileage)
        extra.appendChild(fuel)
        extra.appendChild(transmission)
        extra.appendChild(bodytype)
        extra.appendChild(drive)
        
        let title = document.createElement('div')
        title.setAttribute('class', 'title')
        let spanTitle = document.createElement('span')
        spanTitle.innerHTML = items[x].brand
        title.appendChild(spanTitle)
        
        innerContainer.appendChild(title)
        innerContainer.appendChild(extra)

        container.appendChild(image)
        container.appendChild(innerContainer)
        
        document.querySelector('.autod').appendChild(container)
    }
}