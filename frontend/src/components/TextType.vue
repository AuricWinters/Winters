<template>
  <component
    :is="as"
    ref="containerRef"
    :class="['text-type', className]"
  >
    <span
      class="text-type__content"
      :style="{ color: currentColor }"
    >{{ displayedText }}</span>
    <span
      v-if="showCursor"
      ref="cursorRef"
      :class="['text-type__cursor', cursorClassName, { 'text-type__cursor--hidden': hideCursor }]"
    >{{ cursorCharacter }}</span>
  </component>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  showCursor: { type: Boolean, default: true },
  hideCursorWhileTyping: { type: Boolean, default: false },
  cursorCharacter: { type: String, default: '|' },
  cursorClassName: { type: String, default: '' },
  cursorBlinkDuration: { type: Number, default: 0.5 },
  text: { type: [String, Array], default: '' },
  as: { type: String, default: 'div' },
  typingSpeed: { type: Number, default: 50 },
  initialDelay: { type: Number, default: 0 },
  pauseDuration: { type: Number, default: 2000 },
  deletingSpeed: { type: Number, default: 30 },
  loop: { type: Boolean, default: true },
  textColors: { type: Array, default: () => [] },
  variableSpeed: { type: Object, default: null },
  startOnVisible: { type: Boolean, default: false },
  reverseMode: { type: Boolean, default: false },
})

const emit = defineEmits(['sentenceComplete'])
const containerRef = ref(null)
const cursorRef = ref(null)
const displayedText = ref('')
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)
const isVisible = ref(!props.startOnVisible)

const textArray = computed(() => Array.isArray(props.text) ? props.text : [props.text])

const currentColor = computed(() => {
  if (!props.textColors.length) return 'inherit'
  return props.textColors[currentTextIndex.value % props.textColors.length]
})

const hideCursor = computed(() => {
  if (!props.hideCursorWhileTyping) return false
  return currentCharIndex.value < textArray.value[currentTextIndex.value].length || isDeleting.value
})

let timeouts = []
let cursorInterval = null
let observer = null

function getRandomSpeed() {
  if (!props.variableSpeed) return props.typingSpeed
  const { min, max } = props.variableSpeed
  return Math.random() * (max - min) + min
}

function schedule(fn, delay) {
  const t = setTimeout(fn, delay)
  timeouts.push(t)
  return t
}

function runTypingAnimation() {
  const currentText = textArray.value[currentTextIndex.value]
  const processedText = props.reverseMode ? currentText.split('').reverse().join('') : currentText

  if (isDeleting.value) {
    if (displayedText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === textArray.value.length - 1 && !props.loop) return
      emit('sentenceComplete', textArray.value[currentTextIndex.value], currentTextIndex.value)
      currentTextIndex.value = (currentTextIndex.value + 1) % textArray.value.length
      currentCharIndex.value = 0
      schedule(() => {}, props.pauseDuration)
    } else {
      schedule(() => {
        displayedText.value = displayedText.value.slice(0, -1)
      }, props.deletingSpeed)
    }
  } else {
    if (currentCharIndex.value < processedText.length) {
      const speed = props.variableSpeed ? getRandomSpeed() : props.typingSpeed
      schedule(() => {
        displayedText.value += processedText[currentCharIndex.value]
        currentCharIndex.value++
      }, speed)
    } else if (textArray.value.length >= 1) {
      if (!props.loop && currentTextIndex.value === textArray.value.length - 1) return
      schedule(() => {
        isDeleting.value = true
      }, props.pauseDuration)
    }
  }
}

function startTyping() {
  if (currentCharIndex.value === 0 && !isDeleting.value && displayedText.value === '') {
    schedule(runTypingAnimation, props.initialDelay)
  } else {
    runTypingAnimation()
  }
}

function clearAllTimeouts() {
  timeouts.forEach(clearTimeout)
  timeouts = []
}

watch([currentCharIndex, displayedText, isDeleting, currentTextIndex, isVisible], () => {
  if (!isVisible.value) return
  clearAllTimeouts()
  startTyping()
}, { flush: 'post', deep: false })

watch(textArray, () => {
  clearAllTimeouts()
  currentCharIndex.value = 0
  displayedText.value = ''
  isDeleting.value = false
  currentTextIndex.value = 0
  if (isVisible.value) startTyping()
})

onMounted(async () => {
  await nextTick()
  if (props.startOnVisible && containerRef.value) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    }, { threshold: 0.1 })
    observer.observe(containerRef.value)
  }

  if (props.showCursor && cursorRef.value) {
    let visible = true
    cursorInterval = setInterval(() => {
      visible = !visible
      cursorRef.value.style.opacity = visible ? '1' : '0'
    }, props.cursorBlinkDuration * 1000)
  }

  if (isVisible.value) startTyping()
})

onUnmounted(() => {
  clearAllTimeouts()
  if (cursorInterval) clearInterval(cursorInterval)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.text-type__cursor {
  opacity: 1;
}
.text-type__cursor--hidden {
  opacity: 0;
}
</style>
