namespace pxsim.music {

    let pitches    = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let drumSounds = ["kick", "snare", "hihat", "click", "splat"];

    /**
    * Play a tone.
    * @param note pitch of the tone to play in Hertz (Hz)
    * @param duration number of beats to play tone for
    */
    //% blockId=music_play_tone block="play tone %note=device_note| for %duration=device_beat" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function playTone(note: number, duration: string) { 
        board().monosynth.triggerAttackRelease(note, duration); 
    }

    /**
    * Rest.
    * @param duration number of beats to rest for
    */
    //% blockId=music_rest block="rest for %duration=device_beat" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function rest(duration: string) {
    }

    /**
    * Play a chord.
    * @param notes pitches of the tones to play in Hertz (Hz)
    * @param duration number of beats to play tone for
    */
    //% blockId=music_play_chord block="play chord %notes| for %duration=device_beat" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function playChord(notes: number[], duration: string) {
        //board().polysynth.triggerAttackRelease(notes, duration);
    }

    /**
    * Play a drum beat.
    * @param drum which drum sound to use
    */
    //% blockId=music_play_drum_beat block="play %drum" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    //% drum.fieldEditor="gridpicker"
    //% drum.fieldOptions.width="200" drum.fieldOptions.columns="1"
    //% drum.fieldOptions.tooltips="true"        
    export function drumBeat(drum: Drum) {
        switch (drum) {
            case Drum.Kick:
               board().kickdrum.triggerAttackRelease("C3", "8n");
               break;
            default:
               board().kickdrum.triggerAttackRelease("C3", "8n");
               break;            
        }
    }

    /**
    * Add an effect to a sequence.
    * @param name name of the phrase
    * @param effect which drum sound to use
    */
    //% blockId=music_add_effect_seq block="add %effect|to %name" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    //% effect.fieldEditor="gridpicker"
    //% effect.fieldOptions.width="200" effect.fieldOptions.columns="1"
    //% effect.fieldOptions.tooltips="true"  
    export function addEffectSeq(effect: Effect, name: string) {
        let phrase = board().phrase(name);
        if (phrase) phrase.addEffect(effect);
    }

    /**
    * Remove an effect from a sequence.
    * @param name name of the phrase
    * @param effect which drum sound to use
    */
    //% blockId=music_rem_effect_seq block="remove %effect|from %name" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    //% effect.fieldEditor="gridpicker"
    //% effect.fieldOptions.width="200" effect.fieldOptions.columns="1"
    //% effect.fieldOptions.tooltips="true"  
    export function removeEffectSeq(effect: Effect, name: string) {
        let phrase = board().phrase(name);
        if (phrase) phrase.removeEffect(effect);
    }

    /**
    * Add an effect to every active instrument.
    * @param effect which effect to use
    */
    //% blockId=music_add_effect_global block="add global effect %effect" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    //% effect.fieldEditor="gridpicker"
    //% effect.fieldOptions.width="200" effect.fieldOptions.columns="1"
    //% effect.fieldOptions.tooltips="true"  
    export function addGlobalEffect(effect: Effect) {
        let phrases = board().phrases;
        /* Iterate over phrases and add fx to them */
        for (var phrase in phrases){
            phrases[phrase].addEffect(effect);
        }
        /* Iterate over all of the boards instruments and add fx */
        let fx = tone.createEffect(effect);
        for (let i = 0; i < board().instruments.length; i++)
            board().instruments[i].connect(fx);
    }

    /**
    * Remove an effect to every active instrument.
    * @param effect which effect to use
    */
    //% blockId=music_rem_effect_global block="remove global effect %effect" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    //% effect.fieldEditor="gridpicker"
    //% effect.fieldOptions.width="200" effect.fieldOptions.columns="1"
    //% effect.fieldOptions.tooltips="true"  
    export function removeGlobalEffect(effect: Effect) {
        var type: string;
        switch(effect){
            case Effect.Chorus: 
                type = "chorus";
                break;
            case Effect.Delay:
                type = "delay";
                break;
            case Effect.Distortion:
                type = "distortion";
                break;
            case Effect.Phaser:
                type = "phaser";
                break;
            default:
                type = "reverb";
                break;
            }

        for (let i = 0; i < board().instruments.length; i++){
            board().instruments[i].disconnect(board().fx[type]);
        }

        let phrases = board().phrases;
        for (var phrase in phrases){
            let p = phrases[phrase];
            if (p) p.removeEffect(effect);
        }
    }

    /**
    * Shift pitch by a certain amount of semitones. For reference, an octave is 12 semitones.
    * @param pitch amount in semitones to shift the pitch by
    */
    //% blockId=music_bend block="bend by %pitch| semitones" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function bend(pitch: number) {
        let shift = new Tone.PitchShift(pitch);
        for (let i = 0; i < board().instruments.length; i++)
            board().instruments[i].connect(shift);       
    }
    
    /**
     * Return the duration of a beat in milliseconds (the beat fraction).
     * @param fraction the fraction of the current whole note, eg: BeatFraction.Half
     */
    //% help=music/beat weight=49 blockGap=8
    //% blockId=device_beat block="%fraction|beat" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function beat(fraction?: BeatFraction): string {
        switch (fraction) {
            case BeatFraction.Half: return "2n";
            case BeatFraction.Quarter: return "4n";
            case BeatFraction.Eighth: return "8n";
            case BeatFraction.Sixteenth: return "16n";
            case BeatFraction.Double: return "32n";
            case BeatFraction.Breve: return "64n";
            default: return "8n";
        }
    }  

    /**
     * Get the frequency of a note.
     * @param name the note name, eg: Note.C
     */
    //% weight=1 help=music/note-frequency
    //% blockId=device_note block="%note"
    //% shim=TD_ID
    //% note.fieldEditor="note" note.defl="262" note.fieldOptions.decompileLiterals=true
    //% useEnumVal=1 blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function noteFrequency(name: Note): number {
        return name;
    }      

    /**
     * Plays a phrase once
     * @param name 
     */
    //% blockId=music_play_phrase block="play phrase %name" blockGap=8
    export function playPhrase(name: string) {
        let phrase = board().phrase(name);
        if (phrase) phrase.start(0);
    }

    /**
     * Loops a musical phrase
     * @param name 
     */
    //% blockId=music_loop_phrase block="loop phrase %name" blockGap=8
    export function loopPhrase(name: string) {
        let phrase = board().phrase(name);
        if (phrase) phrase.loop(0);
    }

    /**
     * Stop a musical phrase
     * @param name 
     */
    //% blockId=music_stop_phrase block="stop phrase %name" blockGap=8
    export function stopPhrase(name: string) {
        let phrase = board().phrase(name);
        if (phrase) phrase.stop(0);
    }    

    /**
     * Create a drum pattern
     * @param name
     * @param beat a string describing the beat
     */
    //% blockId="music_drumbeat" block="create beat %name|%beat"
    //% weight=100
    //% beat.fieldEditor="drums"
    //% beat.fieldOptions.onParentBlock=true
    //% beat.fieldOptions.decompileLiterals=true    
    //% blockExternalInputs="true" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function drumPhrase(name: string, beatString: string){ 
        let beat = createNotesMap(JSON.parse(beatString), 8, drumSounds);
        let numTracks = drumSounds.length;
        let phrase = tone.createDrumSequence("8n", 8, beat);
        board().phrases[name] = phrase;
    }

    /**
     * Create a melody pattern
     * @param name
     * @param beat a string describing the beat
     */
    //% blockId="music_phrase" block="create phrase %name|octave %octave|%melody"
    //% weight=100
    //% octave.fieldEditor="gridpicker"
    //% octave.fieldOptions.width="200" octave.fieldOptions.columns="1"
    //% octave.fieldOptions.tooltips="true"      
    //% melody.fieldEditor="melody"
    //% melody.fieldOptions.onParentBlock=true
    //% melody.fieldOptions.decompileLiterals=true    
    //% blockExternalInputs="true" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function notesPhrase(name: string, octave: Octave, melody: string){ 
        let oct = getOctave(octave);
        let notesArray = createNotesMap(JSON.parse(melody), 8, pitches, oct);
        let numTracks = pitches.length;
        let phrase = tone.createMelodySequence("8n", 8, notesArray, numTracks);
        board().phrases[name] = phrase;
    }

    /**
     * Set tempo
     * @param bpm
     */
    //% blockId="music_tempo" block="set tempo %bpm"
    //% weight=100
    //% blockExternalInputs="true" blockGap=8
    //% blockNamespace=music inBasicCategory=true
    export function setTempo(bpm: number){
        tone.bpm(bpm);
    }

    /* translates what beats are active on each track,
       to each note that needs to be played on each beat */
    export function createNotesMap(sequence: pxsim.Map<string[]>, numBeats: number, sounds: string[], octave?: string) : pxsim.Map<string[]> {
        let notesMap = {} as pxsim.Map<string[]>;
        for (let i = 0; i < numBeats; i++){
            let beatNotes = [] as string[];
            let trackindex = 0;
            for (var track in sequence) {
                if (parseInt(sequence[track][i])) {
                    if (octave) beatNotes.push(sounds[trackindex] + octave);
                    else beatNotes.push(sounds[trackindex]);
                }
                trackindex++;
            }
            notesMap[i] = beatNotes;
        }
        notesMap = addRests(notesMap);
        return notesMap;
    }    

    export function getOctave(octave: Octave): string {
        switch(octave){
            case Octave.Lowest: return "2";
            case Octave.Low: return "3";
            case Octave.Middle: return "4";
            case Octave.High: return "5";
            default: return "4";
        }
    }

    export function addRests(notesMap: pxsim.Map<string[]>) : pxsim.Map<string[]> {
        for (var beat in notesMap){
            let seq = notesMap[beat];
            for (let i = 0; i < seq.length; i++){
                if (seq[i].length == 0)
                    seq[i] = null;
            }
        }
        return notesMap;
    }

    /* Class to store all of the details of a user created musical phrase */
    export class Phrase {
        public sequence   : Tone.Sequence;
        public instrument : Tone.Instrument | Tone.MultiPlayer;
        public fx         : pxsim.Map<Tone.Effect>;

        constructor(seq: Tone.Sequence, instr: Tone.Instrument | Tone.MultiPlayer, effects?: pxsim.Map<Tone.Effect>) {
            this.sequence   = seq;
            this.instrument = instr;
            this.fx         = {};
            if (effects)
                this.fx = effects;
        }

        discard(){
            this.sequence.dispose();
        }

        addEffect(effect: Effect){
            var fx : Tone.Effect;
            var type : string;
            switch(effect){
                case Effect.Chorus:
                    fx = new Tone.Chorus(4, 2.5, 0.5).toMaster();
                    type = "chorus";
                    break;
                case Effect.Delay:
                    fx = new Tone.FeedbackDelay("8n").toMaster();
                    type = "delay";
                    break;
                case Effect.Distortion:
                    fx = new Tone.Distortion(0.8).toMaster();
                    type = "distortion";
                    break;
                case Effect.Phaser:
                    fx = new Tone.Phaser({"frequency": 15, 
                                            "octaves": 5, 
                                            "baseFrequency": 1000
                                        }).toMaster();
                    type = "phaser";
                    break;
                default: 
                    fx = new Tone.Freeverb().toMaster();
                    type = "reverb";
                    break;
            }
            this.fx[type] = fx;
            this.instrument.connect(fx);
        }

        removeEffect(effect: Effect){
            var type : string;
            switch(effect){
                case Effect.Chorus: type = "chorus";
                case Effect.Delay: type = "delay";
                case Effect.Distortion: type = "distortion";
                case Effect.Phaser: type = "phaser";
                default: type = "reverb";
            }
            if (this.fx[type]){
                this.instrument.disconnect(this.fx[type]);
                this.fx[type].dispose();
                this.fx[type] = null;
            } 
        }

        start(time: Tone.Time){
            this.sequence.loop = false;           
            this.sequence.start(time);
        }  

        loop(time: Tone.Time){
            this.sequence.loop = true;      
            this.sequence.start(time);
        }

        stop(time: Tone.Time){
            this.sequence.stop(time);
        }             
    }

}