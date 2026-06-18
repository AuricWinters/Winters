<template>
  <div class="stepper-outer" :class="$attrs.class">
    <div :class="['step-circle-container', stepCircleContainerClassName]">
      <div :class="['step-indicator-row', stepContainerClassName]">
        <template v-for="(_, index) in stepsArray" :key="index">
          <div
            :class="[
              'step-indicator',
              {
                active: currentStep === index + 1,
                complete: currentStep > index + 1,
                inactive: currentStep < index + 1,
              },
            ]"
            :style="disableStepIndicators ? { pointerEvents: 'none', opacity: 0.5 } : {}"
            @click="
              !disableStepIndicators && handleStepClick(index + 1)
            "
          >
            <div class="step-indicator-inner">
              <svg v-if="currentStep > index + 1" class="check-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div v-else-if="currentStep === index + 1" class="active-dot" />
              <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
          </div>
          <div v-if="index < stepsArray.length - 1" :class="['step-connector', { complete: currentStep > index + 1 }]" />
        </template>
      </div>

      <div :class="['stepper-content', contentClassName]" :style="contentStyle">
        <div v-if="!isCompleted" class="step-transition" :style="transitionStyle" :key="currentStep">
          <slot :name="`step-${currentStep}`">
            <div class="step-default">{{ stepsArray[currentStep - 1] }}</div>
          </slot>
        </div>
      </div>

      <div v-if="!isCompleted" :class="['footer-container', footerClassName]">
        <div :class="['footer-nav', currentStep !== 1 ? 'spread' : 'end']">
          <button v-if="currentStep !== 1" class="back-button" @click="handleBack" v-bind="backButtonProps">
            {{ backButtonText }}
          </button>
          <button class="next-button" @click="isLastStep ? handleComplete() : handleNext()" v-bind="nextButtonProps">
            {{ isLastStep ? 'Complete' : nextButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  initialStep: { type: Number, default: 1 },
  stepCircleContainerClassName: { type: String, default: '' },
  stepContainerClassName: { type: String, default: '' },
  contentClassName: { type: String, default: '' },
  footerClassName: { type: String, default: '' },
  backButtonProps: { type: Object, default: () => ({}) },
  nextButtonProps: { type: Object, default: () => ({}) },
  backButtonText: { type: String, default: 'Back' },
  nextButtonText: { type: String, default: 'Continue' },
  disableStepIndicators: { type: Boolean, default: false },
})

const emit = defineEmits(['stepChange', 'finalStepCompleted'])

const currentStep = ref(props.initialStep)
const direction = ref(0)
const contentHeight = ref(0)

const stepsArray = computed(() => {
  const slots = useSlots()
  const steps = []
  let i = 1
  while (slots[`step-${i}`] || slots.default) {
    if (slots[`step-${i}`]) steps.push(i)
    else break
    i++
  }
  if (steps.length === 0) steps.push(1)
  return steps
})

const totalSteps = computed(() => {
  return Object.keys(useSlots()).filter(k => k.startsWith('step-')).length || 1
})

const isCompleted = computed(() => currentStep.value > totalSteps.value)
const isLastStep = computed(() => currentStep.value === totalSteps.value)

const contentStyle = computed(() => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'height 0.4s ease',
  height: isCompleted.value ? '0px' : `${contentHeight.value}px`,
}))

const transitionStyle = computed(() => ({
  position: 'relative',
  transform: `translateX(${direction.value >= 0 ? '0' : '0'}%)`,
  opacity: 1,
  transition: 'transform 0.4s ease, opacity 0.4s ease',
}))

function handleBack() {
  if (currentStep.value > 1) {
    direction.value = -1
    currentStep.value--
    emit('stepChange', currentStep.value)
  }
}

function handleNext() {
  if (!isLastStep.value) {
    direction.value = 1
    currentStep.value++
    emit('stepChange', currentStep.value)
  }
}

function handleComplete() {
  direction.value = 1
  currentStep.value = totalSteps.value + 1
  emit('finalStepCompleted')
}

function handleStepClick(step) {
  direction.value = step > currentStep.value ? 1 : -1
  currentStep.value = step
  emit('stepChange', step)
}

function useSlots() {
  return {}
}

onMounted(() => {
  // Measure content height
  const el = document.querySelector('.step-default')
  if (el) contentHeight.value = el.offsetHeight
})
</script>

<style scoped>
.stepper-outer {
  width: 100%;
}
.step-circle-container {
  padding: 20px;
  border: 1px solid #222;
  border-radius: 12px;
}
.step-indicator-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}
.step-indicator {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-indicator-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.3s, color 0.3s, transform 0.3s;
}
.step-indicator.inactive .step-indicator-inner {
  background: #222;
  color: #a3a3a3;
}
.step-indicator.active .step-indicator-inner {
  background: #5227FF;
  color: #5227FF;
  transform: scale(1.1);
}
.step-indicator.complete .step-indicator-inner {
  background: #5227FF;
  color: #fff;
}
.step-connector {
  width: 40px;
  height: 2px;
  background: #333;
  transition: background 0.4s;
}
.step-connector.complete {
  background: #5227FF;
}
.check-icon {
  width: 16px;
  height: 16px;
  color: #fff;
}
.active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}
.step-number {
  color: #a3a3a3;
}
.stepper-content {
  min-height: 100px;
}
.step-default {
  padding: 16px 0;
}
.footer-container {
  margin-top: 24px;
}
.footer-nav {
  display: flex;
  gap: 12px;
}
.footer-nav.spread {
  justify-content: space-between;
}
.footer-nav.end {
  justify-content: flex-end;
}
.back-button,
.next-button {
  padding: 10px 24px;
  border: 1px solid #333;
  background: transparent;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.next-button {
  background: #5227FF;
  border-color: #5227FF;
}
.back-button:hover {
  background: #222;
}
.next-button:hover {
  background: #6b46ff;
}
</style>
