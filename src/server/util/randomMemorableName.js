import animal from 'animal-id'

export const FILTERED_WORDS = [
  // adjectives
  'alluring',
  'bawdy',
  'dead',
  'dirty',
  'erect',
  'female',
  'hard',
  'hot',
  'lewd',
  'macho',
  'male',
  'naughty',
  'obscene',
  'racial',
  'vulgar',
  'womanly',
  'youthful',
  'arrogant',
  'deceitful',
  'fumbling',
  'ugly',
  'chunky',
  'jobless',
  'alcoholic',
  'obese',

  // animals
  'beaver',
  'booby',
  'dik',
  'nutcracker',
  'screamer',
  'woodcock',
]

const FILTER_REGEXP = new RegExp(`(${FILTERED_WORDS.join('|')})`)

const shouldBeFiltered = name => Boolean(name.match(FILTER_REGEXP))

export default function randomMemorableName(generator = animal.getId) {
  let candidateName
  while (!candidateName || shouldBeFiltered(candidateName)) {
    candidateName = generator()
  }
  return candidateName
}
