const VALUE = Symbol();
const INDEX = Symbol();
const SNAPSHOT = Symbol();
const RECORDING = Symbol();
const RECORD_INDEX = Symbol();

export class StringStream {

    constructor (value) {
        this[VALUE] = value;
    }

    /**
     * <div style='sfsf' name='dsaf'></div>
     * <div style='sfsf' name='dsaf'>text</div>
     * <div style='sfsf' name='dsaf'><child><sub>text</sub></child><span></span></div>
     *
     * @throws(StreamException)
     * function readNode () {
     *  var childs = [];
     *  var tag = stream.readNext('<');
     *  var tagName = stream.readNextWord();
     *  stream.startRecording();
     *  var endTag = stream.readNext('>');//todo check previous character to detect autoclose node: <node some='dd'/>, if autoclose -> just don't run while cycle
     *  var nodeTemplate = stream.stopRecording();
     *  while (true) {
     *      stream.startRecording();
         *  stream.readNext('<');
         *  var textNode = stream.stopRecording();
         *  if (textNode.trim().length > 0) {
         *      childs.push({type: 'text', template: textNode});
         *  }
         *  if (stream.next() === '/') {
         *      break;
         *  } else {
         *      stream.moveBack(2);
         *      childs.push(readNode());
         *  }
     *  }
     *  var resp = {tagName: tagName, template: nodeTemplate, children: childs};
     *  return resp;
     * }
     *
     * var nodes = [];
     * while (!stream.isCompleted()) {
     *  nodes.push(readNode());
     * }
     */

    open () {
        moveSnapshot.call(this, 0);
    }

    readNext (sub) {
        const START_INDEX = this[INDEX];
        var isSuccess = false;
        var subLength = sub.length;
        var isSubCh = subLength === 1;
        while (!this.isCompleted()) {
            let nextCh = this.next();
            if (isSubCh) {
                if (nextCh === sub) {
                    isSuccess = true;
                    break;
                }
            } else {
                if (nextCh === sub[0]) {
                    for (let i = 1; i < subLength; i++) {
                        nextCh = this.next();
                        if (nextCh !== sub[i]) {
                            this.moveBack(i);
                            break;
                        }
                        if (i === subLength - 1) {
                            isSuccess = true;
                        }
                    }
                    if (isSuccess) {
                        break;
                    }
                }
            }
        }
        if (!isSuccess) {
            this.moveBack(this[INDEX] - START_INDEX);
        }
        return isSuccess;
    }

    readNextWord () {
        var word = "";
        var wordOpened = false;
        var SPACE = " ";
        while (!this.isCompleted()) {
            let nextCh = this.next();
            if (nextCh === SPACE && !wordOpened) {
                wordOpened = true;
            } else if (nextCh === SPACE && wordOpened) {
                wordOpened = false;
                break;
            } else if (wordOpened) {
                word += nextCh;
            }
        }
        return word;
    }

    next () {
        this.move(1);
        return this.read();
    }

    read() {
        return this[SNAPSHOT][0];
    }

    isFollowing(sub) {
        return sub === this[SNAPSHOT].substring(0, sub.length);
    }

    isCompleted () {
        return this[INDEX] > (this[VALUE].length - 1);
    }

    move (val) {
        moveSnapshot.call(this, this[INDEX] + val);
    }

    moveBack (val) {
        this.move(val * -1);
    }

    startRecording() {
        this[RECORDING] = true;
        this[RECORD_INDEX] = this[INDEX];
    }

    stopRecording() {
        this[RECORDING] = false;
        return this[VALUE].substring(this[RECORD_INDEX], this[INDEX] + 1);
    }

    isRecording() {
        return this[RECORDING];
    }

}

function buildCurrentSnapshot () {
    this[SNAPSHOT] = this[VALUE].substring(this[INDEX]);
}

function moveSnapshot (value) {
    this[INDEX] = value;
    buildCurrentSnapshot.call(this);
}