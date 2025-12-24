import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import App from '@/App.vue'

describe('App.vue', () => {
  let store
  let state
  let actions
  let mutations

  beforeEach(() => {
    // 1. STATE'i sıfırla (Her testten önce temiz başlangıç)
    state = {
      horses: [],
      schedule: [],
      currentRound: 0,
      isRacing: false,
      results: []
    }

    // 2. Mock Actions (Fonksiyonların taklitleri)
    actions = {
      generateGameData: jest.fn()
    }

    // 3. Mock Mutations
    mutations = {
      SET_RACING: jest.fn(),
      ADD_RESULT: jest.fn(),
      SET_CURRENT_ROUND: jest.fn()
    }

    // 4. Store'u oluştur (Vuex 4 yapısı)
    store = createStore({
      state() { return state },
      actions,
      mutations
    })
  })

  // TEST 1: Uygulama açıldığında başlık doğru mu?
  it('renders header title correctly', () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    // h1 etiketini bul ve yazıyı kontrol et
    expect(wrapper.find('h1').text()).toBe('Horse Racing Game')
  })

  // TEST 2: "Generate Program" butonuna basınca fonksiyon çalışıyor mu?
  it('calls generateGameData action when Generate button is clicked', async () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    // .btn-primary sınıfına sahip butonu bul
    const button = wrapper.find('.btn-primary')
    
    // Tıkla
    await button.trigger('click')
    
    // Store'daki generateGameData aksiyonu çağrıldı mı?
    expect(actions.generateGameData).toHaveBeenCalled()
  })

  // TEST 3: Program henüz yokken "Start Race" butonu kapalı (disabled) mı?
  it('disables Start Race button when schedule is empty', () => {
    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    // .btn-success (Start butonu) bul
    const startButton = wrapper.find('.btn-success')
    
    // Disabled özelliği var mı? (Varsa true döner)
    expect(startButton.attributes()).toHaveProperty('disabled')
  })

  // TEST 4: Program oluşturulunca "Start Race" butonu açılıyor mu?
  it('enables Start Race button when schedule exists', () => {
    // State'i doluymuş gibi güncelle
    state.schedule = [{ id: 1, distance: 1200, participants: [] }]
    
    // Store'u güncel state ile yeniden oluştur
    store = createStore({
        state() { return state },
        actions,
        mutations
    })

    const wrapper = shallowMount(App, {
      global: { plugins: [store] }
    })
    
    const startButton = wrapper.find('.btn-success')
    
    // Disabled özelliği OLMAMALI (Undefined olmalı)
    expect(startButton.attributes()).not.toHaveProperty('disabled')
  })
})