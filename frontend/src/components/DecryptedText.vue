<template>
  <span
    ref="containerRef"
    :class="parentClassName"
    :style="wrapperStyle"
    v-on="eventListeners"
  >
    <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0">{{ displayText }}</span>
    <span aria-hidden="true">
      <span
        v-for="(char, index) in displayText.split('')"
        :key="index"
        :class="revealedIndices.has(index) || (!isAnimating && isDecrypted) ? className : encryptedClassName"
      >{{ char }}</span>
    </span>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  speed: { type: Number, default: 50 },
  maxIterations: { type: Number, default: 10 },
  sequential: { type: Boolean, default: false },
  revealDirection: { type: String, default: 'start' },
  useOriginalCharsOnly: { type: Boolean, default: false },
  characters: { type: String, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+' },
  className: { type: String, default: '' },
  parentClassName: { type: String, default: '' },
  encryptedClassName: { type: String, default: '' },
  animateOn: { type: String, default: 'hover' },
  clickMode: { type: String, default: 'once' },
})

const containerRef = ref(null)
const displayText = ref('')
const isAnimating = ref(false)
const revealedIndices = ref(new Set())
const hasAnimated = ref(false)
const isDecrypted = ref(props.animateOn !== 'click')
const direction = ref('forward')

const wrapperStyle = { display: 'inline-block', whiteSpace: 'pre-wrap' }

const availableChars = computed(() => {
  if (props.useOriginalCharsOnly) {
    return Array.from(new Set(props.text.split(''))).filter(c => c !== ' ')
  }
  return props.characters.split('')
})

let intervalId = null
let orderRef = []
let pointerRef = 0

function shuffleText(originalText, currentRevealed) {
  return originalText.split('').map((char, i) => {
    if (char === ' ') return ' '
    if (currentRevealed.has(i)) return originalText[i]
    return availableChars.value[Math.floor(Math.random() * availableChars.value.length)]
  }).join('')
}

function computeOrder(len) {
  const order = []
  if (len <= 0) return order
  if (props.revealDirection === 'start') {
    for (let i = 0; i < len; i++) order.push(i)
    return order
  }
  if (props.revealDirection === 'end') {
    for (let i = len - 1; i >= 0; i--) order.push(i)
    return order
  }
  const middle = Math.floor(len / 2)
  let offset = 0
  while (order.length < len) {
    if (offset % 2 === 0) {
      const idx = middle + offset / 2
      if (idx >= 0 && idx < len) order.push(idx)
    } else {
      const idx = middle - Math.ceil(offset / 2)
      if (idx >= 0 && idx < len) order.push(idx)
    }
    offset++
  }
  return order.slice(0, len)
}

function fillAllIndices() {
  const s = new Set()
  for (let i = 0; i < props.text.length; i++) s.add(i)
  return s
}

function removeRandomIndices(set, count) {
  const arr = Array.from(set)
  for (let i = 0; i < count && arr.length > 0; i++) {
    const idx = Math.floor(Math.random() * arr.length)
    arr.splice(idx, 1)
  }
  return new Set(arr)
}

function triggerDecrypt() {
  if (props.sequential) {
    orderRef = computeOrder(props.text.length)
    pointerRef = 0
    revealedIndices.value = new Set()
  } else {
    revealedIndices.value = new Set()
  }
  direction.value = 'forward'
  isAnimating.value = true
}

function triggerReverse() {
  if (props.sequential) {
    orderRef = computeOrder(props.text.length).slice().reverse()
    pointerRef = 0
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  } else {
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  }
  direction.value = 'reverse'
  isAnimating.value = true
}

function encryptInstantly() {
  revealedIndices.value = new Set()
  displayText.value = shuffleText(props.text, new Set())
  isDecrypted.value = false
}

function handleClick() {
  if (props.animateOn !== 'click') return
  if (props.clickMode === 'once') {
    if (isDecrypted.value) return
    direction.value = 'forward'
    triggerDecrypt()
  }
  if (props.clickMode === 'toggle') {
    if (isDecrypted.value) {
      triggerReverse()
    } else {
      direction.value = 'forward'
      triggerDecrypt()
    }
  }
}

function handleMouseEnter() {
  if (isAnimating.value) return
  if (props.animateOn !== 'hover' && props.animateOn !== 'inViewHover') return
  revealedIndices.value = new Set()
  isDecrypted.value = false
  displayText.value = props.text
  direction.value = 'forward'
  isAnimating.value = true
}

function handleMouseLeave() {
  if (props.animateOn !== 'hover' && props.animateOn !== 'inViewHover') return
  clearInterval(intervalId)
  isAnimating.value = false
  revealedIndices.value = new Set()
  displayText.value = props.text
  isDecrypted.value = true
  direction.value = 'forward'
}

const eventListeners = computed(() => {
  if (props.animateOn === 'click') {
    return { onClick: handleClick }
  }
  if (props.animateOn === 'hover' || props.animateOn === 'inViewHover') {
    return { onMouseenter: handleMouseEnter, onMouseleave: handleMouseLeave }
  }
  return {}
})

// Animation loop
watch(isAnimating, (val) => {
  if (!val) return
  let currentIteration = 0

  function getNextIndex(revealedSet) {
    const textLength = props.text.length
    switch (props.revealDirection) {
      case 'start': return revealedSet.size
      case 'end': return textLength - 1 - revealedSet.size
      case 'center': {
        const middle = Math.floor(textLength / 2)
        const offset = Math.floor(revealedSet.size / 2)
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1
        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i
        }
        return 0
      }
      default: return revealedSet.size
    }
  }

  intervalId = setInterval(() => {
    const prevRevealed = new Set(revealedIndices.value)

    if (props.sequential) {
      if (direction.value === 'forward') {
        if (prevRevealed.size < props.text.length) {
          const nextIndex = getNextIndex(prevRevealed)
          const newRevealed = new Set(prevRevealed)
          newRevealed.add(nextIndex)
          displayText.value = shuffleText(props.text, newRevealed)
          revealedIndices.value = newRevealed
        } else {
          clearInterval(intervalId)
          isAnimating.value = false
          isDecrypted.value = true
        }
      } else {
        if (pointerRef < orderRef.length) {
          const idxToRemove = orderRef[pointerRef++]
          const newRevealed = new Set(prevRevealed)
          newRevealed.delete(idxToRemove)
          displayText.value = shuffleText(props.text, newRevealed)
          revealedIndices.value = newRevealed
          if (newRevealed.size === 0) {
            clearInterval(intervalId)
            isAnimating.value = false
            isDecrypted.value = false
          }
        } else {
          clearInterval(intervalId)
          isAnimating.value = false
          isDecrypted.value = false
        }
      }
    } else {
      if (direction.value === 'forward') {
        displayText.value = shuffleText(props.text, prevRevealed)
        currentIteration++
        if (currentIteration >= props.maxIterations) {
          clearInterval(intervalId)
          isAnimating.value = false
          displayText.value = props.text
          isDecrypted.value = true
        }
      } else {
        let currentSet = prevRevealed
        if (currentSet.size === 0) {
          currentSet = fillAllIndices()
        }
        const removeCount = Math.max(1, Math.ceil(props.text.length / Math.max(1, props.maxIterations)))
        const nextSet = removeRandomIndices(currentSet, removeCount)
        displayText.value = shuffleText(props.text, nextSet)
        revealedIndices.value = nextSet
        currentIteration++
        if (nextSet.size === 0 || currentIteration >= props.maxIterations) {
          clearInterval(intervalId)
          isAnimating.value = false
          isDecrypted.value = false
          displayText.value = shuffleText(props.text, new Set())
          revealedIndices.value = new Set()
        }
      }
    }
  }, props.speed)
})

// View observer
let observer = null
onMounted(async () => {
  await nextTick()
  if (props.animateOn === 'click') {
    encryptInstantly()
  } else {
    displayText.value = props.text
    isDecrypted.value = true
  }

  if (props.animateOn === 'view' || props.animateOn === 'inViewHover') {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.value) {
          triggerDecrypt()
          hasAnimated.value = true
        }
      })
    }, { threshold: 0.1 })
    if (containerRef.value) observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
  if (observer) observer.disconnect()
})

watch(() => props.text, () => {
  clearInterval(intervalId)
  isAnimating.value = false
  revealedIndices.value = new Set()
  direction.value = 'forward'
  if (props.animateOn === 'click') {
    encryptInstantly()
  } else {
    displayText.value = props.text
    isDecrypted.value = true
  }
})
</script>
