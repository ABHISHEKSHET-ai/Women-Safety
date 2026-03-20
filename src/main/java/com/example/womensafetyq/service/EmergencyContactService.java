package com.example.womensafetyq.service;

import com.example.womensafetyq.dto.EmergencyContactRequest;
import com.example.womensafetyq.entity.EmergencyContact;
import com.example.womensafetyq.entity.User;
import com.example.womensafetyq.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmergencyContactService {

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private UserService userService;

    public EmergencyContact addContact(Long userId, EmergencyContactRequest request) {
        User user = userService.getUserById(userId);

        EmergencyContact contact = new EmergencyContact();
        contact.setUser(user);
        contact.setName(request.getName());
        contact.setPhone(request.getPhone());
        contact.setRelation(request.getRelation());

        return emergencyContactRepository.save(contact);
    }

    public List<EmergencyContact> getUserContacts(Long userId) {
        return emergencyContactRepository.findByUserId(userId);
    }

    public EmergencyContact updateContact(Long userId, Long contactId, EmergencyContactRequest request) {
        EmergencyContact contact = emergencyContactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setName(request.getName());
        contact.setPhone(request.getPhone());
        contact.setRelation(request.getRelation());

        return emergencyContactRepository.save(contact);
    }

    public void deleteContact(Long userId, Long contactId) {
        EmergencyContact contact = emergencyContactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        emergencyContactRepository.delete(contact);
    }
}
