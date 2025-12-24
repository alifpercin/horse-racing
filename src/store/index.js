import { createStore } from 'vuex';

export default createStore({
  state: {
    horses: [],
    schedule: [],
    results: [],
    currentRound: 0,
    isRacing: false
  },
  mutations: {
    SET_HORSES(state, horses) {
      state.horses = horses;
    },
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule;
      state.currentRound = 0;
      state.results = [];
    },
    SET_RACING(state, status) {
      state.isRacing = status;
    },
    SET_CURRENT_ROUND(state, round) {
      state.currentRound = round;
    },
    ADD_RESULT(state, result) {
      state.results.push(result);
    }
  },
  actions: {
    generateGameData({ commit }) {
      const horseNames = [
        "Bold Pilot", "Karayel", "Gülbatur", "Secretariat", "Eclipse", 
        "Thunder", "Night Mare", "Storm", "Wind Runner", "Gold Blade", 
        "Iron Fist", "Silver Bullet", "Dark Knight", "Sea Star", "Red Fire", 
        "Shadow", "Pegasus", "Warrior", "Comet", "Spirit"
      ];

      const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', 
        '#33FFF3', '#F3FF33', '#8D33FF', '#FF8D33', '#33FF8D', 
        '#A833FF', '#FF3333', '#33A8FF', '#57FF33', '#5733FF', 
        '#FF3357', '#33F3FF', '#8333FF', '#FF3383', '#3383FF'
      ];
      
      const horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: horseNames[i], 
        color: colors[i],
        condition: Math.floor(Math.random() * 100) + 1
      }));
      
      commit('SET_HORSES', horses);

      const distances = [1200, 1400, 1600, 1800, 2000, 2200];
      const schedule = distances.map((dist, index) => {
        const shuffled = [...horses].sort(() => 0.5 - Math.random());
        return {
          id: index + 1,
          distance: dist,
          participants: shuffled.slice(0, 10).map(p => ({
            ...p,
            progress: 0,
            finishTimeRaw: null,
            finishTimeFormatted: null
          }))
        };
      });
      
      commit('SET_SCHEDULE', schedule);
    }
  }
});