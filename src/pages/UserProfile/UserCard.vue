<template>
  <md-card class="md-card-profile">
    <!-- Avatar removed -->
    <md-card-content>
      <h6 class="category text-gray">{{ currentPerson.role }}</h6>
      <h4 class="card-title">{{ currentPerson.name }}</h4>
      <p class="card-description">"{{ currentPerson.quote }}"</p>
      <md-button class="md-round md-success" @click="pickRandomPerson">
        New Quote
      </md-button>
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  name: "user-card",
  data() {
    return {
      currentPerson: {
        name: "",
        role: "",
        quote: "",
      },
      people: [
        {
          name: "Steve Jobs",
          role: "Visionary / Apple Co-Founder",
          quote:
            "Your time is limited, so don’t waste it living someone else’s life.",
        },
        {
          name: "Genghis Khan",
          role: "Mongol Conqueror",
          quote:
            "If you’re afraid – don’t do it, if you’re doing it – don’t be afraid.",
        },
        {
          name: "Unknown",
          role: "Wisdom on Fear",
          quote: "Everything you’ve ever wanted is on the other side of fear.",
        },
        {
          name: "Continuous Learner",
          role: "Self Improvement",
          quote:
            "Practice isn’t the thing you do once you’re good. It’s the thing you do that makes you good.",
        },
        {
          name: "Marcus Aurelius",
          role: "Roman Emperor / Stoic Philosopher",
          quote:
            "You have power over your mind – not outside events. Realize this, and you will find strength.",
        },
        {
          name: "Rumi",
          role: "Persian Poet / Sufi Mystic",
          quote:
            "Do not be satisfied with stories, how things have gone with others. Unfold your own myth.",
        },
      ],
    };
  },
  mounted() {
    this.pickRandomPerson();
  },
  methods: {
    pickRandomPerson() {
      const randomIndex = Math.floor(Math.random() * this.people.length);
      this.currentPerson = this.people[randomIndex];
    },
  },
};
</script>

<style scoped>
.card-description {
  font-size: 16px;
  font-style: italic;
  line-height: 1.7;
  color: #333;
}
.card-title {
  font-size: 22px;
  font-weight: 700;
  margin-top: 5px;
}
.category {
  font-size: 14px;
  color: #777;
  text-transform: uppercase;
  font-weight: 600;
}
.md-card-profile {
  text-align: center;
  padding: 20px;
}
</style>
