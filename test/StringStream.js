import { StringStream } from '../';

const STRING_1 = 'Some complex and very long string which can be easily managed by string-stream';

describe('StringStream', function() {
    it('should correctly manage operations with string', function() {
        const stream = new StringStream(STRING_1);

        stream.open();
        expect(stream.read()).to.be.equal('S');
        expect(stream.next()).to.be.equal('o');

        stream.startRecording();
        expect(stream.readNext('omplex')).to.be.true;
        expect(stream.stopRecording()).to.be.equal('ome complex');

        stream.move(3);
        expect(stream.read()).to.be.equal('n');

        stream.moveBack(4);
        expect(stream.read()).to.be.equal('e');

        expect(stream.readNextWord()).to.be.equal('and');

        expect(stream.isCompleted()).to.be.false;

        expect(stream.readNext('string')).to.be.true;
        expect(stream.readNext('string')).to.be.true;
        expect(stream.next()).to.be.equal('-');

        expect(stream.readNext('some-not-exist-substr')).to.be.false;
        expect(stream.read()).to.be.equal('-');

        expect(stream.readNext('stred')).to.be.false;
        expect(stream.read()).to.be.equal('-');

        expect(stream.readNext('streamy')).to.be.false;
        expect(stream.read()).to.be.equal('-');
        
        expect(stream.isFollowing('next-invalid-substr')).to.be.false;
        stream.next();
        expect(stream.read()).to.be.equal('s');
        stream.moveBack(1);
        expect(stream.next()).to.be.equal('s');
        expect(stream.isFollowing('stream')).to.be.true;
    
        stream.moveBack(1);
        expect(stream.read()).to.be.equal('-');
        expect(stream.readNext('stream')).to.be.true;
        expect(stream.read()).to.be.equal('m');
        expect(stream.isCompleted()).to.be.false;

        stream.moveBack(1);
        expect(stream.read()).to.be.equal('a');
        expect(stream.isCompleted()).to.be.false;

        stream.move(1);
        expect(stream.next()).to.be.undefined;
        expect(stream.isCompleted()).to.be.true;

        stream.moveBack(1);
        expect(stream.read()).to.be.equal('m');
        expect(stream.isCompleted()).to.be.false;
    });
});