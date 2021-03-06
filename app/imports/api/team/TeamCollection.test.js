import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import moment from 'moment';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Teams } from './TeamCollection';
import { makeSampleChallengeSlugArray } from '../challenge/SampleChallenges';
import { makeSampleToolSlugArray } from '../tool/SampleTools';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';
import { makeSampleDeveloper } from '../user/SampleDevelopers';
import { TeamChallenges } from './TeamChallengeCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('TeamCollection', function testSuite() {

    before(function setup() {
      resetDatabase();
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
          fc.property(fc.lorem(3), fc.lorem(24), fc.boolean(),
              (fcName, description, open) => {
            const name = `${fcName}${moment().format('YYYYMMDDHHmmssSSS')}`;
            const { profileID } = makeSampleDeveloper();
            const owner = profileID;
            const challenges = makeSampleChallengeSlugArray();
            const tools = makeSampleToolSlugArray();
            const skills = makeSampleSkillSlugArray();
            const gitHubRepo = faker.internet.url();
            const devPostPage = faker.internet.url();
            const docID = Teams.define({ name, description, open, owner, gitHubRepo,
              devPostPage, challenges, tools, skills });
            expect(Teams.isDefined(docID)).to.be.true;
            const doc = Teams.findDoc(docID);
            expect(doc.name).to.equal(name);
            expect(doc.description).to.equal(description);
            const selector = { teamID: docID };
            expect(TeamChallenges.find(selector).fetch()).to.have.lengthOf(challenges.length);
            Teams.removeIt(docID);
            expect(Teams.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
  });
}
