from asynctest import TestCase as AsyncTestCase

from ...core.protocol_registry import ProtocolRegistry
from ...storage.base import BaseStorage
from ...transport.wire_format import BaseWireFormat
from ...wallet.base import BaseWallet

from ..default_context import DefaultContextBuilder
from ..injection_context import InjectionContext


class TestDefaultContext(AsyncTestCase):
    async def test_build_context(self):
        """Test context init."""

        builder = DefaultContextBuilder()
        result = await builder.build()
        assert isinstance(result, InjectionContext)

        for cls in (
            BaseWireFormat,
            ProtocolRegistry,
            BaseWallet,
            BaseStorage,
        ):
            assert isinstance(await result.inject(cls), cls)
