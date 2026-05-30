using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet] // api/members
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }
        
        [HttpGet("{id}")] // api/members/test-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;
        }

        [HttpGet("{id}/photos")] // api/test-id/photos
        public async Task<ActionResult<Member>> GetPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }
    }
}
