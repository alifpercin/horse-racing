import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import App from '@/App.vue'

describe('App.vue', () => {
  let store
  let state
  let actions
  let mutations

  beforeEach(() => {
    state = {
      horses: [],
      schedule: [],
      currentRound: 0,
      isRacing: false,
      results: []
    }

    actions = {
      generateGameData: jest.fn()
    }

    mutations = {
      SET_RACING: jest.fn(),
      ADD_RESULT: jest.fn(),
      SET_CURRENT_ROUND: jest.fn()
    }

    store = createStore({
      state() { return state },
      actions,
      mutations
    })
  })

  it('renders header title correctly', () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    expect(wrapper.find('h1').text()).toBe('Horse Racing Game')
  })

  it('calls generateGameData action when Generate button is clicked', async () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    const button = wrapper.find('.btn-primary')
    
    await button.trigger('click')
    
    expect(actions.generateGameData).toHaveBeenCalled()
  })

  it('disables Start Race button when schedule is empty', () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    const startButton = wrapper.find('.btn-success')
    
    expect(startButton.attributes()).toHaveProperty('disabled')
  })

  it('enables Start Race button when schedule exists', () => {
    state.schedule = [{ id: 1, distance: 1200, participants: [] }]
    
    store = createStore({
        state() { return state },
        actions,
        mutations
    })

    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    const startButton = wrapper.find('.btn-success')
    
    expect(startButton.attributes()).not.toHaveProperty('disabled')
  })
})
