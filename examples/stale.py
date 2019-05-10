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
        channel.line("after construction:")
        channel.line(f"  formSlc:")
        f.pyre_dump(channel=channel, indent=' '*2)
        channel.line(f"  raw:")
        f.raw.pyre_dump(channel=channel, indent=' '*2)
        channel.line(f"  slc:")
        f.slc.pyre_dump(channel=channel, indent=' '*2)

        # flush
        channel.log()

        # make a RAW
        raw = flo.isce.newRAW()
        # configure it
        raw.samples = 5000
        raw.lines = 15000

        # make an SLC
        slc = flo.isce.newSLC()

        # bind everything together
        f.raw = raw
        f.slc = slc

        # show me the state
        channel.line("after binding:")
        channel.line(f"  formSlc:")
        f.pyre_dump(channel=channel, indent=' '*2)
        channel.line(f"  raw:")
        f.raw.pyre_dump(channel=channel, indent=' '*2)
        channel.line(f"  slc:")
        f.slc.pyre_dump(channel=channel, indent=' '*2)

        # flush
        channel.log()

        # check
        assert f.raw.pyre_stale == True
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
        assert slc.lines == raw.lines
        assert slc.samples == raw.samples

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
