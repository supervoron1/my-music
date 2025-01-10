interface Weather {
    type: string,
    icon: string,
    image: string,
    audio: HTMLAudioElement,
}

const weather: Weather[] = [
    {type: 'rain', icon: 'cloud-rain.svg', image: 'rainy-bg.jpg', audio: new Audio('./sounds/rain.mp3')},
    {type: 'summer', icon: 'sun.svg', image: 'summer-bg.jpg', audio: new Audio('./sounds/summer.mp3')},
    {type: 'winter', icon: 'cloud-snow.svg', image: 'winter-bg.jpg', audio: new Audio('./sounds/winter.mp3')},
]

const INITIAL_BACKGROUND = weather[1].image
const controlsContainer = document.querySelector('.controls-container') as HTMLElement
const rangeSlider = document.querySelector('.range-slider') as HTMLElement
let currentAudio: HTMLAudioElement | null = null

const renderControlButtons = (items: Weather[]) => {
    items.forEach(item => {
        controlsContainer.insertAdjacentHTML("beforeend", `
            <button class="control-button" data-type="${item.type}" style="background-image: url('/images/${item.image}')">
                <img src="/icons/${item.icon}" alt="${item.type}">
            </button>
        `)
    })
}

const setBackground = (image: string) => {
    document.body.style.backgroundImage = `url('/images/${image}')`
}

const initializeControls = () => {
    const controlButtons = document.querySelectorAll('.control-button')
    controlButtons.forEach(btn => {
        const weatherType = (btn as HTMLElement).dataset.type
        if (weatherType) {
            btn.addEventListener('click', () => {
                if (currentAudio && !currentAudio.paused && currentAudio.src.includes(weatherType)) {
                    currentAudio.pause()
                } else {
                    changeWeather(weatherType)
                }
            })
        } else {
            console.log('data-type attribute is missing')
        }
    })
}

const initializeVolumeRangeSlider = () => {
    rangeSlider.addEventListener('mousemove', (event) => {
        const target = event.currentTarget as HTMLInputElement
        const minValue = parseInt(target.getAttribute('min') || '0')
        const maxValue = parseInt(target.getAttribute('max') || '0')
        const value = (parseInt(target.value) - minValue) / (maxValue - minValue)
        rangeSlider.style.background = `linear-gradient(to right, #4872F2 ${value * 100}%, #FFFFFF ${value * 100}%)`
        setVolume(currentAudio as HTMLAudioElement, value)
    })
}

const changeWeather = (weatherType: string) => {
    const selectedWeather = weather.find(x => x.type === weatherType)

    if (!selectedWeather) {
        console.log(`Weather type missing for: ${weatherType}`)
        return
    }

    setBackground(selectedWeather.image)
    stopCurrentAudio()

    currentAudio = selectedWeather.audio

    const volume = parseFloat((rangeSlider as HTMLInputElement).value) / 100
    setVolume(currentAudio, volume)

    currentAudio.play().finally()
}

const stopCurrentAudio = () => {
    if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
    }
}

const setVolume = (audio: HTMLAudioElement, volume: number) => {
    if (audio) {
        audio.volume = volume
    }
}

const initializeApp = () => {
    setBackground(INITIAL_BACKGROUND)
    renderControlButtons(weather)
    initializeControls()
    initializeVolumeRangeSlider()
}

initializeApp()