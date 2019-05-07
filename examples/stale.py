#!/usr/bin/env python3
# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo

# my app
class Stale(flo.flow.workflow, family="flo.applications.stale"):
    """
    Examine the flow node naming strategy
    """


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info

        # make a new SLC factory
        f = flo.isce.newFormSLC()

        # show me the state
        channel.line("instantiation:")
        channel.line(f"  raw: {f.raw.pyre_stale}")
        channel.line(f"  slc: {f.slc.pyre_stale}")
        channel.log()

        # get the {raw} observers
        # rawObservers = tuple(f.raw.pyre_status.observers)
        # show me
        # print(f"f.raw observers: {rawObservers}")

        # mark an input as stale explicitly
        channel.log("explicit update:")
        f.raw.uri = "home/mga/tmp/data/isce/raw.img"
        channel.line("after explicit update:")
        channel.line(f"  raw: {f.raw.pyre_stale}")
        channel.line(f"  slc: {f.slc.pyre_stale}")
        channel.log()

        # check
        assert f.raw.pyre_stale == True
        assert f.slc.pyre_stale == True

        # force a reset
        f.raw.pyre_stale = True
        f.slc.pyre_stale = False

        # make a RAW
        raw = flo.isce.newRAW()
        # and an SLC
        slc = flo.isce.newSLC()
        # bind everything together
        f.raw = raw
        f.slc = slc

        # show me the state
        channel.line("after binding: stale:")
        channel.line(f"  raw: {raw.pyre_stale}")
        channel.line(f"  slc: {slc.pyre_stale}")
        channel.log()

        # check
        assert f.raw.pyre_stale == False
        assert f.slc.pyre_stale == True

        # force the remake
        f.slc.pyre_make()

        # show me the state
        channel.line("after rebuilding: stale:")
        channel.line(f"  raw: {raw.pyre_stale}")
        channel.line(f"  slc: {slc.pyre_stale}")
        channel.log()

        # check
        assert f.raw.pyre_stale == False
        assert f.slc.pyre_stale == False

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Stale(name="stale")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
