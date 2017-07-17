import bluebird from 'bluebird'
import factoryGirl from 'factory-girl'

import chapterFactoryDefine from './chapter'
import memberFactoryDefine from './member'
import poolMemberFactoryDefine from './poolMember'
import moderatorFactoryDefine from './moderator'
import userFactoryDefine from './user'
import cycleFactoryDefine from './cycle'
import voteFactoryDefine from './vote'
import projectFactoryDefine from './project'
import surveyFactoryDefine from './survey'
import surveyBlueprintFactoryDefine from './surveyBlueprint'
import poolFactoryDefine from './pool'
import questionFactoryDefine from './question'
import responseFactoryDefine from './response'
import memberGoalRankFactoryDefine from './memberGoalRank'
import phaseFactoryDefine from './phase'
import feedbackTypeFactoryDefine from './feedbackType'
import RethinkDBAdapter from './RethinkDBAdapter'

const factory = factoryGirl.promisify(bluebird)
factory.setAdapter(new RethinkDBAdapter())

chapterFactoryDefine(factory)
memberFactoryDefine(factory)
poolMemberFactoryDefine(factory)
moderatorFactoryDefine(factory)
userFactoryDefine(factory)
cycleFactoryDefine(factory)
voteFactoryDefine(factory)
projectFactoryDefine(factory)
surveyFactoryDefine(factory)
surveyBlueprintFactoryDefine(factory)
poolFactoryDefine(factory)
questionFactoryDefine(factory)
responseFactoryDefine(factory)
memberGoalRankFactoryDefine(factory)
phaseFactoryDefine(factory)
feedbackTypeFactoryDefine(factory)

export default factory
