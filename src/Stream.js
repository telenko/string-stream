/**
 * Created by andrey on 02.03.2017.
 */
export class Stream {

    constructor (value) {
        this.value = value;
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

    value;
    index;
    _currentSnapshot;
    _isRecording = false;

    open () {
        moveSnapshot.call(this, 0);
    }

    readNext (sub) {
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
        return isSuccess;
    }

    readNextWord () {
        var word = "";
        var wordOpened = false;
        var SPACE = " ";
        while (!this.isCompleted()) {
            let nextCh = this.next();
            if (nextCh !== SPACE && !wordOpened) {
                wordOpened = true;
            }
            if (nextCh === SPACE && wordOpened) {
                wordOpened = false;
                break;
            }
            if (wordOpened) {
                word += nextCh;
            }
        }
        return word;
    }

    next () {
        this.move(1);
        return this._currentSnapshot[0];
    }

    isCompleted () {
        return this.index > (this.value.length - 1);
    }

    move (val) {
        moveSnapshot.call(this, this.index + val);
    }

    moveBack (val) {
        this.move(val * -1);
    }

    startRecording() {
        this._isRecording = true;
        this._recordStart = this.index;
    }

    stopRecording() {
        this._isRecording = false;
        return this.value.substring(this._recordStart, this.index + 1);
    }

    isRecording() {
        return this._isRecording;
    }

}

function buildCurrentSnapshot () {
    this._currentSnapshot = this.value.substring(this.index);
}

function moveSnapshot (value) {
    this.index = value;
    buildCurrentSnapshot.call(this);
}