package com.alibou.book.role;

import java.util.Optional;

//@Repository
public interface RoleRepository{// extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(String role);
}
