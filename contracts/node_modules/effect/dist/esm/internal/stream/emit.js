import * as Cause from "../../Cause.js";
import * as Chunk from "../../Chunk.js";
import * as Effect from "../../Effect.js";
import * as Exit from "../../Exit.js";
import { pipe } from "../../Function.js";
import * as Option from "../../Option.js";
/** @internal */
export const make = emit => {
  const ops = {
    chunk(as) {
      return this(Effect.succeed(as));
    },
    die(defect) {
      return this(Effect.die(defect));
    },
    dieMessage(message) {
      return this(Effect.dieMessage(message));
    },
    done(exit) {
      return this(Effect.suspend(() => Exit.mapBoth(exit, {
        onFailure: Option.some,
        onSuccess: Chunk.of
      })));
    },
    end() {
      return this(Effect.fail(Option.none()));
    },
    fail(e) {
      return this(Effect.fail(Option.some(e)));
    },
    fromEffect(effect) {
      return this(Effect.mapBoth(effect, {
        onFailure: Option.some,
        onSuccess: Chunk.of
      }));
    },
    fromEffectChunk(effect) {
      return this(pipe(effect, Effect.mapError(Option.some)));
    },
    halt(cause) {
      return this(Effect.failCause(pipe(cause, Cause.map(Option.some))));
    },
    single(value) {
      return this(Effect.succeed(Chunk.of(value)));
    }
  };
  return Object.assign(emit, ops);
};
/** @internal */
export const makePush = mailbox => {
  let finished = false;
  function array(items) {
    if (finished) return false;
    return Chunk.isEmpty(mailbox.unsafeOfferAll(items));
  }
  function done(exit) {
    if (finished) return;
    finished = true;
    if (exit._tag === "Success") {
      mailbox.unsafeOffer(exit.value);
    }
    mailbox.unsafeDone(exit._tag === "Success" ? Exit.void : exit);
  }
  return {
    single(value) {
      return finished ? false : mailbox.unsafeOffer(value);
    },
    array,
    chunk(chunk) {
      return array(Chunk.toReadonlyArray(chunk));
    },
    done,
    end() {
      if (finished) return;
      finished = true;
      mailbox.unsafeDone(Exit.void);
    },
    halt(cause) {
      return done(Exit.failCause(cause));
    },
    fail(error) {
      return done(Exit.fail(error));
    },
    die(defect) {
      return done(Exit.die(defect));
    },
    dieMessage(message) {
      return done(Exit.die(new Error(message)));
    }
  };
};
//# sourceMappingURL=emit.js.map